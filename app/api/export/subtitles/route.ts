import { NextResponse } from 'next/server';

function formatSrtTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function formatVttTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subtitles, format = 'srt', title = 'subtitles' } = body;

    if (!Array.isArray(subtitles)) {
      return NextResponse.json({ error: 'Invalid subtitles array' }, { status: 400 });
    }

    if (format === 'vtt') {
      let vttContent = 'WEBVTT\n\n';
      subtitles.forEach((sub, idx) => {
        const start = formatVttTimestamp(sub.start);
        const end = formatVttTimestamp(sub.end);
        vttContent += `${idx + 1}\n${start} --> ${end}\n${sub.text}\n\n`;
      });

      return new Response(vttContent, {
        headers: {
          'Content-Type': 'text/vtt',
          'Content-Disposition': `attachment; filename="${title}.vtt"`,
        },
      });
    }

    // Default SRT
    let srtContent = '';
    subtitles.forEach((sub, idx) => {
      const start = formatSrtTimestamp(sub.start);
      const end = formatSrtTimestamp(sub.end);
      srtContent += `${idx + 1}\n${start} --> ${end}\n${sub.text}\n\n`;
    });

    return new Response(srtContent, {
      headers: {
        'Content-Type': 'application/x-subrip',
        'Content-Disposition': `attachment; filename="${title}.srt"`,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Subtitle export failed' },
      { status: 500 }
    );
  }
}
