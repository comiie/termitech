import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import occtImport from 'occt-import-js';
import { Accessor, Document, NodeIO } from '@gltf-transform/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? path.join(projectRoot, 'public', 'models', 'connector.glb');

if (!sourcePath) {
  throw new Error('Usage: node scripts/convert-step.mjs <source.step> [output.glb]');
}

const occt = await occtImport();
const source = await fs.readFile(sourcePath);
const result = occt.ReadStepFile(source, {
  linearUnit: 'millimeter',
  linearDeflectionType: 'bounding_box_ratio',
  linearDeflection: 0.0025,
  angularDeflection: 0.28,
});

if (!result.success || !result.meshes?.length) {
  throw new Error('The STEP file could not be tessellated.');
}

const names = ['主体外壳', '端子 A', '端子 B', '端子 C', '端子 D', '密封件'];
const fallbackColors = [
  [0.94, 0.70, 0.04, 1],
  [0.22, 0.29, 0.39, 1],
  [0.22, 0.29, 0.39, 1],
  [0.22, 0.29, 0.39, 1],
  [0.22, 0.29, 0.39, 1],
  [0.02, 0.70, 0.74, 1],
];

const document = new Document();
const buffer = document.createBuffer();
const scene = document.createScene('电控连接器');

result.meshes.forEach((sourceMesh, index) => {
  const faceColor = sourceMesh.color ?? sourceMesh.brep_faces?.find((face) => face.color)?.color;
  const color = faceColor ? [...faceColor, 1] : fallbackColors[index] ?? [0.7, 0.7, 0.7, 1];
  const material = document.createMaterial(`${names[index] ?? `零件 ${index + 1}`}材质`)
    .setBaseColorFactor(color)
    .setMetallicFactor(index > 0 && index < 5 ? 0.72 : 0.05)
    .setRoughnessFactor(index > 0 && index < 5 ? 0.28 : 0.43);

  const positions = new Float32Array(sourceMesh.attributes.position.array);
  const normals = sourceMesh.attributes.normal?.array
    ? new Float32Array(sourceMesh.attributes.normal.array)
    : null;
  const IndexArray = positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
  const indices = new IndexArray(sourceMesh.index.array);

  const positionAccessor = document.createAccessor().setType(Accessor.Type.VEC3).setArray(positions).setBuffer(buffer);
  const normalAccessor = normals
    ? document.createAccessor().setType(Accessor.Type.VEC3).setArray(normals).setBuffer(buffer)
    : null;
  const indexAccessor = document.createAccessor().setType(Accessor.Type.SCALAR).setArray(indices).setBuffer(buffer);

  const primitive = document.createPrimitive()
    .setAttribute('POSITION', positionAccessor)
    .setIndices(indexAccessor)
    .setMaterial(material);
  if (normalAccessor) primitive.setAttribute('NORMAL', normalAccessor);

  const mesh = document.createMesh(names[index] ?? `零件 ${index + 1}`).addPrimitive(primitive);
  const node = document.createNode(names[index] ?? `零件 ${index + 1}`)
    .setMesh(mesh)
    .setExtras({ partIndex: index, source: 'KZ08TEPAR0921' });
  scene.addChild(node);
});

await fs.mkdir(path.dirname(outputPath), { recursive: true });
const io = new NodeIO();
await io.write(outputPath, document);
console.log(`Wrote ${result.meshes.length} parts to ${outputPath}`);
