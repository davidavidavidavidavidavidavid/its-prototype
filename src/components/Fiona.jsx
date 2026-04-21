const POSES = {
  neutral: '/fiona/BAC Online Characters_Fiona Neutral 1.svg',
  'neutral-2': '/fiona/BAC Online Characters_Fiona Neutral 2.svg',
  gesturing: '/fiona/BAC Online Characters_Fiona Gesturing.svg',
  happy: '/fiona/BAC Online Characters_Fiona Happy.svg',
};

export default function Fiona({ pose = 'neutral', height = 160, maxHeight, className = '', imgStyle = {} }) {
  const src = POSES[pose] || POSES.neutral;
  return (
    <img
      src={src}
      alt={`Fiona — ${pose}`}
      style={{ height, maxHeight, width: 'auto', display: 'block', ...imgStyle }}
      className={className}
    />
  );
}
