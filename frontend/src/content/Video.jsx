// components/Video.jsx
export default function Video({ src, className }) {
  const html = `<video autoPlay muted loop><source src=${src} /></video>`;
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} className={className} />
  );
}
