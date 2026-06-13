import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { component } = await req.json();

    let command = '';
    const cwd = process.cwd();

    if (component === 'aiEngine') {
      // Start AI Engine in a new command prompt window
      command = 'start "AI Engine (Whisper)" cmd /k "cd ../../ai-engine && uvicorn api:app --host 0.0.0.0 --port 8000"';
      // Wait, process.cwd() in Next.js app directory might be apps/web.
      // Let's use an absolute path or relative to apps/web.
      const aiEnginePath = path.join(process.cwd(), '../../ai-engine');
      command = `start "AI Engine (Whisper)" cmd /k "cd /d ${aiEnginePath} && run.bat"`;
    } else if (component === 'database') {
      // Start docker-compose
      const rootPath = path.join(process.cwd(), '../../');
      command = `start "Docker Services" cmd /k "cd /d ${rootPath} && docker-compose up -d"`;
    } else if (component === 'videoService' || component === 'web') {
      // Since restarting web/videoService kills current process, it's better to launch start.bat in root
      const rootPath = path.join(process.cwd(), '../../');
      command = `start "Audira Services" cmd /k "cd /d ${rootPath} && start.bat"`;
    } else if (component === 'ollama') {
      command = 'start "Ollama" cmd /k "ollama serve"';
    }

    if (command) {
      exec(command, (error) => {
        if (error) {
          console.error(`Error executing fix for ${component}:`, error);
        }
      });
      return NextResponse.json({ success: true, message: `Command executed: ${command}` });
    }

    return NextResponse.json({ success: false, message: 'Unknown component' }, { status: 400 });
  } catch (error) {
    console.error('Failed to execute fix', error);
    return NextResponse.json({ success: false, message: 'Failed to execute fix' }, { status: 500 });
  }
}
