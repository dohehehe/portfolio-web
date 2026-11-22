"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useLocale } from "@/components/locale/LocaleProvider";
import { getMuxPlaybackId } from "@/components/work/gallery/galleryUtils";
import styles from "./GalleryMuxVideo.module.css";

const VARIANT_CLASS = {
  fullWidth: styles.fullWidth,
  pair: styles.pair,
  carousel: styles.carousel,
  preview: styles.preview,
};

const LABELS = {
  ko: {
    controls: "비디오 컨트롤",
    play: "재생",
    pause: "일시정지",
    mute: "음소거",
    unmute: "음소거 해제",
    progress: "재생 위치",
    volume: "볼륨",
  },
  en: {
    controls: "Video controls",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    progress: "Playback position",
    volume: "Volume",
  },
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4.2 2.6v10.8L13.2 8 4.2 2.6z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.4 2.4h3.1v11.2H3.4zm6.1 0h3.1v11.2H9.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function VolumeIcon({ muted }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1.8 6.1h2.3L7.4 3.2v9.6L4.1 9.9H1.8V6.1z" fill="currentColor" />
      {muted ? (
        <path
          d="M10 6.1 13.6 9.7M13.6 6.1 10 9.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ) : (
        <path
          d="M10.1 5.1a3.3 3.3 0 0 1 0 5.8M12.2 3.4a5.6 5.6 0 0 1 0 9.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

export default function GalleryMuxVideo({
  videoUrl,
  title = "",
  variant = "fullWidth",
  className = "",
}) {
  const locale = useLocale();
  const labels = LABELS[locale] ?? LABELS.ko;
  const playerRef = useRef(null);
  const pointerTypeRef = useRef("mouse");
  const seekingRef = useRef(false);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(true);
  const [holding, setHolding] = useState(false);
  const [touchOpen, setTouchOpen] = useState(false);

  const playbackId = getMuxPlaybackId(videoUrl);
  const variantClassName = VARIANT_CLASS[variant] ?? VARIANT_CLASS.fullWidth;

  useEffect(() => {
    if (!holding) {
      return undefined;
    }

    const end = () => {
      seekingRef.current = false;
      setHolding(false);

      const player = playerRef.current;
      const nextTime = player?.currentTime;

      if (Number.isFinite(nextTime)) {
        setCurrentTime(nextTime);
      }
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);

    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [holding]);

  if (!playbackId) {
    return null;
  }

  function syncFromPlayer() {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const nextDuration = player.duration;
    const nextTime = player.currentTime;

    setPaused(Boolean(player.paused || player.ended));
    if (!seekingRef.current) {
      setCurrentTime(Number.isFinite(nextTime) ? nextTime : 0);
    }
    setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
    setVolume(Number.isFinite(player.volume) ? player.volume : 1);
    setMuted(Boolean(player.muted));
  }

  function togglePlayback() {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (player.paused || player.ended) {
      if (player.ended) {
        player.currentTime = 0;
      }

      player.play()?.catch(() => {});
      return;
    }

    player.pause();
  }

  function seekToRatio(ratio) {
    const player = playerRef.current;

    if (!player || !Number.isFinite(player.duration) || player.duration <= 0) {
      return;
    }

    const nextTime = Math.min(1, Math.max(0, ratio)) * player.duration;
    player.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleSeek(event) {
    const player = playerRef.current;
    const nextTime = Number(event.target.value);

    if (!player || !Number.isFinite(nextTime)) {
      return;
    }

    player.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleTimelinePointerDown(event) {
    if (event.button !== 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    seekingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekToRatio((event.clientX - rect.left) / rect.width);
  }

  function handleTimelinePointerMove(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    seekToRatio((event.clientX - rect.left) / rect.width);
  }

  function handleTimelinePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    seekingRef.current = false;
  }

  function applyVolume(nextVolume) {
    const player = playerRef.current;

    if (!player || !Number.isFinite(nextVolume)) {
      return;
    }

    const clamped = Math.min(1, Math.max(0, nextVolume));

    if (clamped === 0) {
      player.muted = true;
    } else {
      player.volume = clamped;
      player.muted = false;
    }

    setVolume(player.volume);
    setMuted(player.muted);
  }

  function handleVolume(event) {
    applyVolume(Number(event.target.value));
  }

  function handleVolumePointerDown(event) {
    if (event.button !== 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    applyVolume((event.clientX - rect.left) / rect.width);
  }

  function handleVolumePointerMove(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    applyVolume((event.clientX - rect.left) / rect.width);
  }

  function handleVolumePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function toggleMuted() {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (player.muted || player.volume === 0) {
      player.muted = false;
      if (player.volume === 0) {
        player.volume = 1;
      }
    } else {
      player.muted = true;
    }

    setVolume(player.volume);
    setMuted(player.muted);
  }

  const progressValue = duration > 0 ? Math.min(currentTime, duration) : 0;
  const progressPercent = duration > 0 ? (progressValue / duration) * 100 : 0;
  const shownVolume = muted ? 0 : Math.min(1, Math.max(0, volume));

  return (
    <div
      className={[
        styles.shell,
        variantClassName,
        holding ? styles.holding : "",
        touchOpen ? styles.touchOpen : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={(event) => {
        pointerTypeRef.current = event.pointerType;
      }}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setTouchOpen(false);
        }
      }}
      onClick={() => {
        if (pointerTypeRef.current === "touch") {
          setTouchOpen((open) => !open);
        }
      }}
    >
      <MuxPlayer
        ref={playerRef}
        className={styles.player}
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay="muted"
        muted
        nohotkeys
        noVolumePref
        noMutedPref
        playsInline
        metadata={{ video_title: title || undefined }}
        onPlay={syncFromPlayer}
        onPlaying={syncFromPlayer}
        onPause={syncFromPlayer}
        onEnded={syncFromPlayer}
        onTimeUpdate={syncFromPlayer}
        onVolumeChange={syncFromPlayer}
        onLoadedMetadata={syncFromPlayer}
        onDurationChange={syncFromPlayer}
        onSeeked={syncFromPlayer}
      />
      <div
        className={styles.controls}
        role="group"
        aria-label={labels.controls}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => {
          event.stopPropagation();
          setHolding(true);
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        <button
          type="button"
          className={styles.button}
          aria-label={paused ? labels.play : labels.pause}
          onClick={togglePlayback}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
        <div
          className={styles.timeline}
          onPointerDown={handleTimelinePointerDown}
          onPointerMove={handleTimelinePointerMove}
          onPointerUp={handleTimelinePointerUp}
          onPointerCancel={handleTimelinePointerUp}
        >
          <input
            className={styles.range}
            style={{ "--fill": `${progressPercent}%` }}
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={progressValue}
            disabled={!duration}
            aria-label={labels.progress}
            onChange={handleSeek}
          />
        </div>
        <div className={styles.volume}>
          <button
            type="button"
            className={styles.button}
            aria-label={
              muted || shownVolume === 0 ? labels.unmute : labels.mute
            }
            onClick={toggleMuted}
          >
            <VolumeIcon muted={muted || shownVolume === 0} />
          </button>
          <div
            className={styles.volumeTrack}
            onPointerDown={handleVolumePointerDown}
            onPointerMove={handleVolumePointerMove}
            onPointerUp={handleVolumePointerUp}
            onPointerCancel={handleVolumePointerUp}
          >
            <input
              className={`${styles.range} ${styles.volumeRange}`}
              style={{ "--fill": `${shownVolume * 100}%` }}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={shownVolume}
              aria-label={labels.volume}
              onChange={handleVolume}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
