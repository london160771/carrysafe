import { beforeEach, describe, expect, it, vi } from 'vitest';

const generateContent = vi.fn();
vi.mock('./models.js', async (importOriginal) => ({
  ...(await importOriginal()),
  onDeviceImageModel: () => ({ generateContent }),
}));

const { extractLabel, framingCoach } = await import('./onDevice.js');
const { ON_DEVICE_IMAGE_PARAMS } = await import('./models.js');

const jpeg = new Blob([new Uint8Array([255, 216, 255])], { type: 'image/jpeg' });
const reply = (text, inferenceSource = 'on_device') => ({ response: { text: () => text, inferenceSource } });

describe('on-device calls (FR-SCAN-001/002, INV-2)', () => {
  beforeEach(() => {
    generateContent.mockReset();
  });

  it('uses ONLY_ON_DEVICE with image input and no cloud params', () => {
    expect(ON_DEVICE_IMAGE_PARAMS.mode).toBe('only_on_device');
    expect(ON_DEVICE_IMAGE_PARAMS.inCloudParams).toBeUndefined();
    expect(ON_DEVICE_IMAGE_PARAMS.onDeviceParams.createOptions.expectedInputs).toContainEqual({ type: 'image' });
  });

  it('sends the image inline to the device model and keeps only label fields', async () => {
    generateContent.mockResolvedValue(
      reply('{"brand":"Orphesic","ingredients":["Orphenadrine citrate","paracetamol"],"strength":"35 mg/450 mg","quantity":null,"patient":"Mum"}'),
    );
    const result = await extractLabel(jpeg);
    expect(generateContent.mock.calls[0][0][1].inlineData.mimeType).toBe('image/jpeg');
    expect(Object.keys(result).sort()).toEqual(['brand', 'inferenceSource', 'ingredients', 'quantity', 'raw', 'strength']);
    expect(result.inferenceSource).toBe('on_device');
  });

  it('returns the Framing Coach hint', async () => {
    generateContent.mockResolvedValue(reply('{"readable": false, "hint": "Move the box left, the label is cut off on the right."}'));
    await expect(framingCoach(jpeg)).resolves.toMatchObject({ readable: false, hint: expect.stringMatching(/left/) });
  });

  it('maps a missing device model to nano_unavailable', async () => {
    generateContent.mockImplementation(async () => {
      throw new Error('device model missing');
    });
    await expect(extractLabel(jpeg)).rejects.toMatchObject({ code: 'nano_unavailable' });
  });

  it('maps unparseable output to label_unreadable', async () => {
    generateContent.mockResolvedValue(reply('I cannot read this'));
    await expect(framingCoach(jpeg)).rejects.toMatchObject({ code: 'label_unreadable', retryable: true });
  });

  it('refuses non JPEG/PNG images before calling the model', async () => {
    await expect(extractLabel(new Blob(['x'], { type: 'image/gif' }))).rejects.toThrow(TypeError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});
