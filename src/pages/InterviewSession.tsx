import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Circle,
  Square,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getInterview, startInterview, uploadMedia } from '../services/api';
import type { Interview } from '../types';

const DEFAULT_QUESTIONS = [
  'Tell us about yourself and your technical background.',
  'Describe a challenging technical problem you solved and how you approached it.',
  'Why are you interested in this role and what value can you bring?',
];

export default function InterviewSession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState('');
  const [phase, setPhase] = useState<'consent' | 'interview' | 'done'>('consent');
  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (id) getInterview(id).then((r) => setInterview(r.data));
  }, [id]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  const enableMedia = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setMediaReady(true);
      setMediaError('');
      if (id) await startInterview(id);
    } catch {
      setMediaError('Camera/microphone permission denied. You can still type responses.');
      setMediaReady(true);
    }
  };

  const toggleCamera = async () => {
    if (recording) return;

    if (cameraOn) {
      stream?.getVideoTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream(
          stream?.getAudioTracks() ?? []
        );
      }

      setCameraOn(false);
      return;
    }

    try {
      const newCameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const newVideoTrack = newCameraStream.getVideoTracks()[0];

      if (!stream) {
        const newStream = new MediaStream([newVideoTrack]);
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } else {
        stream.addTrack(newVideoTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }

      setCameraOn(true);
      setMediaError('');
    } catch {
      setMediaError('Unable to turn the camera back on.');
    }
  };

  const toggleMic = async () => {
  if (recording) return;

  if (micOn) {
    stream?.getAudioTracks().forEach((track) => track.stop());

    setMicOn(false);
    return;
  }

  try {
    const newAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const newAudioTrack = newAudioStream.getAudioTracks()[0];

    if (!stream) {
      const newStream = new MediaStream([newAudioTrack]);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } else {
      stream.addTrack(newAudioTrack);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    setMicOn(true);
    setMediaError('');
  } catch {
    setMediaError('Unable to turn the microphone back on.');
  }
};

  const startRecording = () => {
    if (!stream) return;

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });

    recordedChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.start();

    mediaRecorderRef.current = recorder;

    setRecording(true);
    setTimer(0);
    setTranscript('');

    timerRef.current = window.setInterval(
      () => setTimer((t) => t + 1),
      1000
    );
  };

  const stopRecording = () => {
    setRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = async () => {
        const recordedBlob = new Blob(recordedChunksRef.current, {
          type: 'video/webm',
        });

        recordedChunksRef.current = [];

        try {
          const uploadedMedia = await uploadMedia(recordedBlob);

          console.log('Media uploaded successfully:', uploadedMedia);
        } catch (error) {
          console.error('Media upload failed:', error);
          setMediaError('We could not upload your recording. Please try again.');
        }
      };

      recorder.stop();
    }

    mediaRecorderRef.current = null;

    if (!transcript.trim()) {
      setTranscript(
        '[Demo] Your spoken response would appear here via speech recognition or backend transcription.'
      );
    }
  };

  const nextQuestion = () => {
    const questions = interview?.questions?.length
      ? interview.questions.map((q) => q.text)
      : DEFAULT_QUESTIONS;
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setTranscript('');
      setTimer(0);
    } else {
      stream?.getTracks().forEach((t) => t.stop());
      setPhase('done');
    }
  };

  const questions = interview?.questions?.length
    ? interview.questions.map((q) => q.text)
    : DEFAULT_QUESTIONS;

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (phase === 'done') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Interview submitted</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your responses are being processed securely. You can close this window.
          </p>
          <Button className="mt-6" onClick={() => navigate(`/processing/${id}`)}>
            View processing status
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'consent') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">
                HireNext<span className="text-indigo-500">.ai</span>
              </p>
              <p className="text-xs text-slate-400">Secure multimodal interview</p>
            </div>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {interview?.jobTitle || 'Software Engineer'} Interview
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This session records video and audio for AI-assisted assessment. Your data is processed
            securely and used only for hiring evaluation.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" /> Encrypted session transport
            </li>
            <li className="flex items-center gap-2">
              <Video className="h-4 w-4 text-indigo-500" /> Camera & microphone required
            </li>
            <li className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-indigo-500" /> Responses transcribed for analysis
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={() => { setPhase('interview'); enableMedia(); }}>
              I consent — begin interview
            </Button>
          </div>
          <p className="mt-3 text-center text-[11px] text-slate-400">
            By continuing you agree to the interview privacy notice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800 px-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="font-bold">
            HireNext<span className="text-indigo-400">.ai</span>
          </span>
          <span className="ml-3 text-sm text-slate-400">
            {interview?.jobTitle || 'Software Engineer'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand">
            Question {qIndex + 1} / {questions.length}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-3.5 w-3.5 text-emerald-400" /> Secure session
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 p-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Video */}
        <div>
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`h-full w-full object-cover ${!cameraOn ? 'opacity-0' : ''}`}
            />
            {!mediaReady && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                Enabling camera...
              </div>
            )}
            {!cameraOn && mediaReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="h-12 w-12 text-slate-600" />
              </div>
            )}
            {recording && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold">
                <Circle className="h-2.5 w-2.5 fill-white" /> REC {fmt(timer)}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={cameraOn ? 'secondary' : 'danger'}
              size="sm"
              onClick={toggleCamera}
            >
              {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              Camera
            </Button>
            <Button
              variant={micOn ? 'secondary' : 'danger'}
              size="sm"
              onClick={toggleMic}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              Mic
            </Button>
            {!recording ? (
              <Button onClick={startRecording} disabled={!mediaReady}>
                <Circle className="h-4 w-4 fill-white" /> Start Response
              </Button>
            ) : (
              <Button variant="danger" onClick={stopRecording}>
                <Square className="h-4 w-4" /> Stop Response
              </Button>
            )}
            <Button
              variant="primary"
              onClick={nextQuestion}
              disabled={recording || (!transcript.trim() && timer === 0)}
            >
              {qIndex < questions.length - 1 ? 'Save & Next' : 'Submit Interview'}
            </Button>
          </div>
          {mediaError && (
            <p className="mt-3 text-center text-xs text-amber-400">{mediaError}</p>
          )}
        </div>

        {/* Question panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Question {qIndex + 1}
            </p>
            <p className="mt-2 text-lg font-semibold leading-snug text-white">
              {questions[qIndex]}
            </p>
          </div>

          <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400">Response transcript</p>
              {recording && (
                <span className="text-[10px] font-bold text-red-400">● Listening</span>
              )}
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={
                recording
                  ? 'Speak your answer — transcript will appear here...'
                  : 'Start recording, then speak or type your answer.'
              }
              className="h-48 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2 text-[11px] text-slate-500">
            <span className={`flex items-center gap-1 ${mediaReady ? 'text-emerald-400' : ''}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mediaReady ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              Camera ready
            </span>
            <span className={`flex items-center gap-1 ${mediaReady ? 'text-emerald-400' : ''}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${mediaReady ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              Microphone ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}