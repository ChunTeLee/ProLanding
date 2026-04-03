<script lang="ts">
	import { onMount } from "svelte";
	import type { Auth } from "../lib/Auth.ts";
	import type { Promotion } from "../components/PromoBanner/Promotion.ts";

	import { PROMOTION_UNKNOWN } from "../components/PromoBanner/Promotion.ts";
	import { PROVIDERS_INFO } from "../components/InferenceWidget/providers.ts";
	import App from "../components/App/App.svelte";
	import IconStorage from "../components/Icons/IconStorage.svelte";
	import IconDataset from "../components/Icons/IconDataset.svelte";
	import IconCollection from "../components/Icons/IconCollection.svelte";
	import IconSubscribeDisk from "../components/Icons/IconSubscribeDisk.svelte";
	import PromoBanner from "../components/PromoBanner/PromoBanner.svelte";
	import PromoInvalid from "../components/PromoBanner/PromoInvalid.svelte";
	import profilePic from "../assets/profile pic.png";
	import proStarIcon from "../assets/icon_proStar.svg";
	import oProIcon from "../assets/O_PRO.svg";
	import iconDataset from "../assets/icon_dataset.svg";
	import iconStorage from "../assets/icon_storage.svg";
	import iconZeroGPU from "../assets/icon_zeroGPU.svg";
	import iconCredits from "../assets/icon_credits.svg";
	import iconPost from "../assets/icon_post.svg";

	const floatingIcons = [
		{ src: iconDataset, top: 22, left: 22, color: [255, 100, 103], tooltip: "Private dataset viewer" },
		{ src: iconStorage, top: 50, left: 18, color: [81, 162, 255], tooltip: "10x Storage" },
		{ src: iconZeroGPU, top: 20, left: 72, color: [255, 255, 255], tooltip: "Unlock ZeroGPU for Spaces" },
		{ src: iconCredits, top: 52, left: 76, color: [254, 230, 133], tooltip: "20x Inference Credits" },
		{ src: iconPost, top: 10, left: 58, color: [255, 184, 0], tooltip: "Write Community Post" },
	];

	// Reactive icon offsets driven by the wave
	let iconOffsets: { x: number; y: number }[] = floatingIcons.map(() => ({ x: 0, y: 0 }));

	export let auth: Auth.UserAuthInfoFront;
	export let promo: Promotion | typeof PROMOTION_UNKNOWN | undefined;
	export let godmode = false;

	const visibleProviders = [
		"groq",
		"together",
		"hyperbolic",
		"fal-ai",
		"sambanova",
		"replicate",
		"cerebras",
		"fireworks-ai",
	].map(key => PROVIDERS_INFO[key]);

	const subscribeUrl = typeof promo === "object" ? `/subscribe/pro?promo=${promo.promoId}` : "/subscribe/pro";

	// Dot wave canvas — stores dot grid positions for future magnet/repulsion effects
	let dotCanvas: HTMLCanvasElement;

	interface Dot {
		ox: number; oy: number;  // original grid position
		x: number; y: number;    // current displaced position
	}

	let dots: Dot[] = [];
	let dotGap = 10;

	function buildDotGrid(w: number, h: number) {
		dots = [];
		for (let gx = 0; gx <= w; gx += dotGap) {
			for (let gy = 0; gy <= h; gy += dotGap) {
				dots.push({ ox: gx, oy: gy, x: gx, y: gy });
			}
		}
	}

	function initDotWave() {
		if (!dotCanvas) return;
		const ctx = dotCanvas.getContext('2d')!;
		const dpr = window.devicePixelRatio || 1;
		let raf: number;

		function resize() {
			const w = dotCanvas.clientWidth;
			const h = dotCanvas.clientHeight;
			dotCanvas.width = w * dpr;
			dotCanvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			buildDotGrid(w, h);
		}

		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(dotCanvas);

		const dotRadius = 0.7;
		const waveAmp = 2.2;          // px displacement amplitude
		const waveFreq = 0.035;       // spatial frequency
		const waveSpeed = 0.0012;     // more dynamic speed
		const baseColor = [30, 41, 57]; // #1E2939
		const iconRadius = 80;        // px radius of color influence

		function draw(time: number) {
			const w = dotCanvas.clientWidth;
			const h = dotCanvas.clientHeight;
			ctx.clearRect(0, 0, w, h);

			// Precompute icon pixel positions (centered — CSS positions are top-left of the pill)
			const iconHalf = 27; // ~half of icon pill size (30px icon + padding)
			const iconPositions = floatingIcons.map((icon, idx) => {
				const baseX = (icon.left / 100) * w + iconHalf;
				const baseY = (icon.top / 100) * h + iconHalf;
				const off = iconOffsets[idx] || { x: 0, y: 0 };
				return {
					px: baseX + off.x,
					py: baseY + off.y,
					color: icon.color,
					radius: iconRadius,
				};
			});

			// Profile pic gradient rim — 3 color emitters around the avatar circle
			const avatarEl = heroEl?.querySelector('.avatar-ring');
			if (avatarEl) {
				const heroRect2 = dotCanvas.getBoundingClientRect();
				const avRect = avatarEl.getBoundingClientRect();
				const avCx = (avRect.left + avRect.width / 2 - heroRect2.left) / (window.devicePixelRatio || 1) * (window.devicePixelRatio || 1);
				const avCy = (avRect.top + avRect.height / 2 - heroRect2.top) / (window.devicePixelRatio || 1) * (window.devicePixelRatio || 1);
				const avCxP = avRect.left + avRect.width / 2 - heroRect2.left;
				const avCyP = avRect.top + avRect.height / 2 - heroRect2.top;
				const avR = avRect.width / 2;
				const rimRadius = 65;

				// Pink-red at top-left of ring
				iconPositions.push({ px: avCxP - avR * 0.7, py: avCyP - avR * 0.7, color: [246, 51, 154], radius: rimRadius });
				// Green at bottom-right of ring
				iconPositions.push({ px: avCxP + avR * 0.5, py: avCyP + avR * 0.7, color: [0, 188, 125], radius: rimRadius });
			}

			for (let i = 0; i < dots.length; i++) {
				const dot = dots[i];

				// Wave displacement
				const phase = (dot.ox + dot.oy) * waveFreq - time * waveSpeed;
				const wave = Math.sin(phase);
				dot.x = dot.ox + wave * waveAmp * 0.707;
				dot.y = dot.oy + wave * waveAmp * 0.707;

				// Color: blend toward nearest icon color based on distance
				let r = baseColor[0], g = baseColor[1], b = baseColor[2];
				let maxInfluence = 0;

				for (const ip of iconPositions) {
					const dx = dot.x - ip.px;
					const dy = dot.y - ip.py;
					const dist = Math.sqrt(dx * dx + dy * dy);
					const rad = ip.radius || iconRadius;
					if (dist < rad) {
						const influence = 1 - dist / rad;
						const sq = influence * influence; // quadratic falloff
						if (sq > maxInfluence) {
							maxInfluence = sq;
							r = baseColor[0] + (ip.color[0] - baseColor[0]) * sq;
							g = baseColor[1] + (ip.color[1] - baseColor[1]) * sq;
							b = baseColor[2] + (ip.color[2] - baseColor[2]) * sq;
						}
					}
				}

				// Edge fade by size — dots shrink near edges
				const edgeFade = 100; // px from edge where fade starts
				const ex = Math.min(dot.ox, w - dot.ox, edgeFade) / edgeFade;
				const ey = Math.min(dot.oy, h - dot.oy, edgeFade) / edgeFade;
				const edgeScale = Math.min(ex, ey);
				const finalR = dotRadius * edgeScale;
				if (finalR < 0.1) continue;

				ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
				ctx.beginPath();
				ctx.arc(dot.x, dot.y, finalR, 0, Math.PI * 2);
				ctx.fill();
			}

			// Update floating icon offsets using the same wave
			const newOffsets = floatingIcons.map((icon) => {
				const px = (icon.left / 100) * w;
				const py = (icon.top / 100) * h;
				const phase = (px + py) * waveFreq - time * waveSpeed;
				const wave = Math.sin(phase);
				return {
					x: wave * waveAmp * 2.5 * 0.707,
					y: wave * waveAmp * 2.5 * 0.707,
				};
			});
			iconOffsets = newOffsets;

			raf = requestAnimationFrame(draw);
		}

		raf = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}

	// Perspective lines — only above the CTA divider, converging to avatar center
	let heroEl: HTMLElement;
	let linePaths = "";
	let distortion = 0;

	function computeLines() {
		if (!heroEl) return;
		const w = heroEl.offsetWidth;
		const h = heroEl.offsetHeight;

		// Find the divider position
		const divider = heroEl.querySelector('.hero-divider');
		const maxY = divider ? divider.offsetTop : h * 0.75;

		// Find the actual avatar center by measuring the element
		const avatar = heroEl.querySelector('.avatar-ring');
		let cx = w / 2;
		let cy = h * 0.28;
		if (avatar) {
			const heroRect = heroEl.getBoundingClientRect();
			const avatarRect = avatar.getBoundingClientRect();
			cx = (avatarRect.left + avatarRect.width / 2) - heroRect.left;
			cy = (avatarRect.top + avatarRect.height / 2) - heroRect.top;
		}

		// Compute distortion for perspective text
		// Reference repo uses hypot * 0.14 but their section is full-viewport.
		// We scale down to fit our smaller hero, targeting distortion ~3-6 range.
		const dx = w;
		const dy = (maxY - cy) / 2;
		distortion = Math.hypot(dx, dy) * 0.003;

		// Helper: generate N+1 evenly spaced points from 0 to length (always includes both endpoints)
		function subdivide(length: number, approxGap: number): number[] {
			const n = Math.max(1, Math.round(length / approxGap));
			const step = length / n;
			const pts: number[] = [];
			for (let i = 0; i <= n; i++) pts.push(i * step);
			return pts;
		}

		const targetGap = window.innerWidth > 767 ? 200 : 140;

		// Horizontal points along top/bottom edges (includes 0 and w → covers left+right corners)
		const hPts = subdivide(w, targetGap);
		// Vertical points along left/right edges (includes 0 and maxY → covers top+bottom corners)
		const vPts = subdivide(maxY, targetGap);

		let d = "";

		// Lines from top edge → avatar (all hPts at y=0)
		for (const x of hPts) {
			d += `M ${x} 0 L ${cx} ${cy} `;
		}
		// Lines from bottom of clipped zone → avatar (all hPts at y=maxY)
		for (const x of hPts) {
			d += `M ${x} ${maxY} L ${cx} ${cy} `;
		}
		// Lines from left edge → avatar (vPts excluding first/last which are corners already drawn)
		for (let i = 1; i < vPts.length - 1; i++) {
			d += `M 0 ${vPts[i]} L ${cx} ${cy} `;
		}
		// Lines from right edge → avatar
		for (let i = 1; i < vPts.length - 1; i++) {
			d += `M ${w} ${vPts[i]} L ${cx} ${cy} `;
		}

		linePaths = d;
	}

	onMount(() => {
		computeLines();
		const ro = new ResizeObserver(() => computeLines());
		ro.observe(heroEl);
		const cleanupDots = initDotWave();
		return () => {
			ro.disconnect();
			cleanupDots?.();
		};
	});

	/** Border color token reused everywhere */
	const bc = "border-[#141c2e]";
</script>

<App {auth} {godmode} footerSize="big">
	<div class="w-full bg-gray-950">
		{#if promo === PROMOTION_UNKNOWN}
			<div class="mx-auto max-w-7xl px-4"><PromoInvalid /></div>
		{:else if promo}
			<div class="mx-auto max-w-7xl px-4"><PromoBanner {promo} /></div>
		{/if}

		<!-- ============ HERO ============ -->
		<section
			class="hero-section relative flex flex-col items-center justify-center overflow-hidden border-l border-r {bc} mx-auto max-w-7xl"
			bind:this={heroEl}
			style="height: 520px;"
		>
			<canvas bind:this={dotCanvas} class="pointer-events-none absolute inset-0 h-full w-full"></canvas>

			<!-- Floating icon pills — wave-driven wiggle -->
			{#each floatingIcons as icon, i}
				<div
					class="icon-pill group absolute z-50 flex items-center gap-[3px] rounded-full transition-all duration-200"
					style="top: {icon.top}%; left: {icon.left}%; transform: translate({iconOffsets[i].x}px, {iconOffsets[i].y}px); --hover-bg: rgba({icon.color[0]}, {icon.color[1]}, {icon.color[2]}, 0.1); padding: 3px 8px;"
				>
					<img src={icon.src} alt="" style="width: 30px; height: 30px;" />
					<!-- Text appears on hover -->
					<span
						class="pointer-events-none max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover:max-w-xs group-hover:opacity-100"
						style="color: rgb({icon.color[0]}, {icon.color[1]}, {icon.color[2]}); font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 400;"
					>
						{icon.tooltip}
					</span>
				</div>
			{/each}

			<!-- Profile pic with gradient rim + gap + star + name badge -->
			<div class="relative z-10 flex flex-col items-center" style="margin-top: 40px;">
				<!-- Pro Star icon -->
				<img
					src={proStarIcon}
					alt=""
					class="absolute z-20"
					style="width: 28px; height: 28px; left: 7px; top: 11px; filter: drop-shadow(3px 0 0 #030712) drop-shadow(-3px 0 0 #030712) drop-shadow(0 3px 0 #030712) drop-shadow(0 -3px 0 #030712);"
				/>
				<!-- Gradient ring with 2px gap -->
				<div class="avatar-ring rounded-full p-[3px]" style="background: linear-gradient(135deg, rgba(246,51,154,0.7), rgba(0,188,125,0.7), rgba(254,154,0,0.7));">
					<div class="rounded-full p-[3px]" style="background: #030712;">
						<div class="overflow-hidden rounded-full">
							<img
								src={profilePic}
								alt="Profile"
								class="block rounded-full bg-[#d1d5db] object-cover"
								style="width: 100px; height: 100px;"
							/>
							</div>
					</div>
				</div>

				<!-- Username + PRO badge -->
				<div class="flex items-center gap-1.5" style="margin-top: 10px;">
					<span class="text-[18px] font-semibold leading-none text-gray-200" style="opacity: 0.8;">your name</span>
					<span
						class="inline-flex -skew-x-12 items-center rounded-md border border-[#141c2e] px-1.5 py-0.5 text-[11px] font-bold leading-none text-black"
						style="background: linear-gradient(151deg, rgb(246,51,154) 0%, rgb(0,188,125) 50%, rgb(254,154,0) 100%); box-shadow: 0 10px 15px -3px rgba(0,188,125,0.2), 0 4px 6px -4px rgba(0,188,125,0.2);"
					>PRO</span>
				</div>
			</div>

			<!-- Title + Subtitle — 20px below profile group -->
			<div class="relative z-10 flex flex-col items-center" style="margin-top: 20px;">
				<h1 class="inline-flex items-baseline whitespace-nowrap tracking-[-1.8px] text-white text-5xl sm:text-6xl md:text-[72px] md:leading-[72px]" style="font-weight: 700;">
					<span>Hugging Face</span>
					<span class="relative ml-[0.15em] inline-flex items-baseline">
						<span
							class="relative bg-clip-text text-transparent"
							style="font-weight: 700; background-image: linear-gradient(151deg, rgb(246,51,154) 15%, rgb(0,188,125) 50%, rgb(254,154,0) 100%); -webkit-background-clip: text;"
						>PR</span><img src={oProIcon} alt="O" class="relative inline-block" style="height: 0.72em; vertical-align: baseline; margin-left: -0.01em;" />
						<span
							class="absolute left-0 top-0 bg-clip-text text-transparent opacity-50 blur-xl"
							style="font-weight: 700; background-image: linear-gradient(151deg, rgb(246,51,154) 15%, rgb(0,188,125) 50%, rgb(254,154,0) 100%); -webkit-background-clip: text;"
						>PRO</span>
					</span>
				</h1>
				<p class="text-xl text-[#99a1af] sm:text-2xl" style="margin-top: 20px;">
					The all-in-one subscription to discover, use, and build with AI.
				</p>
				<a
					href={subscribeUrl}
					class="flex w-fit items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f3f4f6] px-6 py-2.5 text-xl text-black shadow-[0_0_0_4px_#030712,0_0_0_5px_#f3f4f6] transition-all hover:bg-white"
					style="margin-top: 40px;"
				>
					<span>→</span>
					<span>Subscribe to HF PRO ($9/month)</span>
				</a>
			</div>
		</section>

		<!-- Full-width horizontal line between hero and next section -->
		<div class="w-full border-b {bc}"></div>

		<!-- ============ SPACES ZEROGPU ============ -->
		<section class="w-full border-b {bc}">
			<article class="mx-auto grid max-w-7xl overflow-hidden border-l border-r {bc} bg-gray-950 lg:grid-cols-2">
				<div class="order-2 p-8 sm:p-10 lg:order-1 lg:p-14">
					<span class="text-smd mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
						Spaces ZeroGPU
					</span>
					<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">Your go-to for AI Apps</h2>
					<p class="text-lg text-gray-400">
						<a href="/spaces" target="_blank" class="font-medium text-indigo-400 hover:underline">Hugging Face Spaces</a>
						is the largest directory of AI Apps, with more than 500k available apps to explore the entire spectrum of AI,
						covering text, image, video, audio, 3D, and more.
						<br /><br />
						Hugging Face PRO gives you <strong class="text-gray-200">8× more daily quota</strong>, including up to
						<strong class="text-gray-200">25 minutes of H200 compute</strong> for seamless daily use of AI Apps.
					</p>
				</div>
				<div class="relative order-1 overflow-hidden lg:order-2">
					<video
						class="size-full object-cover"
						autoplay muted playsinline loop preload="auto"
						poster="https://cdn-uploads.huggingface.co/production/uploads/5f17f0a0925b9863e28ad517/6HNd1mK-Kpt7aGnBs9kj6.webp"
					>
						<source src="https://cdn-uploads.huggingface.co/production/uploads/5f17f0a0925b9863e28ad517/C-Cj-8A_3ymx4BIABwW0Q.mp4" type="video/mp4" />
					</video>
				</div>
			</article>
		</section>

		<!-- ============ FEATURE CARDS (ZeroGPU + Dev Mode) ============ -->
		<section class="w-full border-b {bc}">
			<div class="mx-auto grid max-w-7xl border-l border-r {bc} bg-gray-950 md:grid-cols-2">
				<article class="flex items-start gap-6 border-b border-r {bc} p-8 max-sm:flex-col sm:items-center sm:p-10 md:border-b-0">
					<div class="flex w-full items-center justify-center overflow-hidden rounded-xl bg-gray-900 max-sm:h-28 sm:size-32">
						<svg class="text-8xl" width="1em" height="1em" viewBox="0 0 33 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect width="29.28" height="9.85" rx="3" transform="matrix(1 0 -.27564 .96126 3.33 .47)" fill="currentColor" class="text-gray-800" />
							<path d="M7.58 2.78c1.25 0 1.28 1 .63 1.32-.28.14-.4.43-.45.7.13.05.25.13.34.24 1.02-.55 2.13-.33 2.13.66 0 1.25-1 1.28-1.32.62-.14-.27-.43-.4-.7-.45a.9.9 0 0 1-.25.34c.56 1.03.34 2.13-.66 2.13-1.24 0-1.27-1-.61-1.32.27-.14.39-.43.45-.68a.86.86 0 0 1-.35-.26c-1.02.55-2.12.34-2.12-.66 0-1.25.99-1.28 1.31-.62.14.28.43.4.7.45a.81.81 0 0 1 .25-.34c-.55-1.03-.34-2.13.65-2.13Zm19.44.48c.42 0 .76.09 1.02.26.27.18.44.43.52.76.08.33.06.74-.08 1.21-.14.48-.34.89-.62 1.23a2.65 2.65 0 0 1-2.14 1.05 1.8 1.8 0 0 1-1.01-.27 1.26 1.26 0 0 1-.52-.78c-.08-.34-.05-.75.09-1.23.14-.47.34-.88.61-1.2a2.75 2.75 0 0 1 2.13-1.03Zm-11.1.78-2.61 2.68h1.86l-.27.96h-3.34l.2-.7 2.62-2.68H12.7l.28-.96h3.14l-.2.7Zm3.57.26h-1.72l-.2.69h1.48l-.28.96H17.3l-.22.77h1.79l-.28.96h-2.98l1.24-4.34h2.92l-.28.96Zm2.93-.96c.33 0 .61.04.86.13.25.08.43.22.54.43.1.2.11.48 0 .84-.08.32-.22.57-.42.78-.19.2-.41.37-.66.48l.5 1.68H21.9l-.36-1.45h-.46l-.42 1.45h-1.2l1.25-4.34h1.71Zm4.32.91c-.27 0-.52.1-.74.33-.22.21-.38.52-.5.91-.1.4-.12.7-.03.94.1.23.27.35.54.35a1 1 0 0 0 .74-.35c.22-.23.4-.54.5-.94.12-.4.13-.7.03-.91-.09-.22-.27-.33-.54-.33ZM7.44 5.29a.28.28 0 0 0 0 .55.28.28 0 1 0 0-.55Zm13.9.03h.43c.48 0 .78-.2.89-.58.05-.18.03-.31-.08-.38-.1-.07-.26-.11-.5-.11h-.43l-.3 1.07Z" fill="currentColor" class="text-gray-200" />
						</svg>
					</div>
					<div class="flex-1">
						<h3 class="mb-2 text-2xl font-bold text-white">Host your own ZeroGPU Spaces</h3>
						<p class="text-balance text-gray-400">Shape your AI experience your way. Create or duplicate up to 10 ZeroGPU Spaces for ultimate flexibility.</p>
					</div>
				</article>
				<article class="flex items-start gap-6 p-8 max-sm:flex-col sm:items-center sm:p-10">
					<div class="flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-950/20 to-cyan-950/20 max-sm:h-28 sm:size-32">
						<img alt="VS Code logo" src="https://cdn-uploads.huggingface.co/production/uploads/5f17f0a0925b9863e28ad517/zJPKmmRbqL8mklJXiH6zp.png" class="size-12 object-cover" />
					</div>
					<div class="flex-1">
						<h3 class="mb-2 text-2xl font-bold text-white">Dev Mode for Spaces</h3>
						<p class="text-gray-400">Develop at lightning speed. Use SSH or VS Code to connect to your Spaces and iterate quickly, with built-in hot reload.</p>
					</div>
				</article>
			</div>
		</section>

		<!-- ============ SPACER ============ -->
		<div class="w-full border-b {bc}">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>

		<!-- ============ STORAGE ============ -->
		<section class="w-full border-b {bc}">
			<article class="mx-auto grid max-w-7xl overflow-hidden border-l border-r {bc} bg-gray-950 lg:grid-cols-2">
				<div class="p-8 sm:p-10 lg:p-14">
					<span class="text-smd mb-4 inline-block rounded-full bg-blue-900/30 px-4 py-1 font-semibold text-blue-400">Storage</span>
					<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">Get 10× more Storage</h2>
					<p class="text-lg text-gray-400">
						Every model, dataset, and
						<a href="/storage" target="_blank" class="font-medium text-blue-400 hover:underline">Storage Bucket</a>
						on the Hugging Face Hub gets fast, reliable storage that grows with your projects.
						<br /><br />
						Hugging Face PRO bumps your private storage to <strong class="text-gray-200">1 TB</strong> and doubles your public limit to
						<strong class="text-gray-200">10 TB</strong>.
					</p>
				</div>
				<div class="relative flex items-center justify-center overflow-hidden bg-blue-950/20 p-8 max-lg:order-first max-lg:py-10 lg:p-12">
					<div class="w-full max-w-md space-y-6">
						<div class="rounded-xl bg-gray-800 p-5 shadow-sm">
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-4">Private Storage</p>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<span class="w-12 shrink-0 text-xs text-gray-400">Free</span>
									<div class="h-3 w-full rounded-full bg-gray-700"><div class="w-1/10 h-full rounded-full bg-gray-500"></div></div>
									<span class="whitespace-nowrap font-mono text-xs text-gray-400">100 GB</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-12 shrink-0"><span class="inline-block -skew-x-12 rounded-md bg-blue-900/50 px-2 py-0.5 text-xs font-bold uppercase text-blue-300">PRO</span></span>
									<div class="h-3 w-full rounded-full bg-blue-950/30"><div class="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-500"></div></div>
									<span class="whitespace-nowrap font-mono text-xs font-medium text-blue-400">1 TB</span>
								</div>
							</div>
						</div>
						<div class="rounded-xl bg-gray-800 p-5 shadow-sm">
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-4">Public Storage</p>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<span class="w-12 shrink-0 text-xs text-gray-400">Free</span>
									<div class="h-3 w-full rounded-full bg-gray-700"><div class="h-full w-1/2 rounded-full bg-gray-500"></div></div>
									<span class="whitespace-nowrap font-mono text-xs text-gray-400">~5 TB</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-12 shrink-0"><span class="inline-block -skew-x-12 rounded-md bg-blue-900/50 px-2 py-0.5 text-xs font-bold uppercase text-blue-300">PRO</span></span>
									<div class="h-3 w-full rounded-full bg-blue-950/30"><div class="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-500"></div></div>
									<span class="whitespace-nowrap font-mono text-xs font-medium text-blue-400">10 TB</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</article>
		</section>

		<!-- ============ SPACER ============ -->
		<div class="w-full border-b {bc}">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>

		<!-- ============ INFERENCE ============ -->
		<section class="w-full border-b {bc}">
			<article class="mx-auto grid max-w-7xl overflow-hidden border-l border-r {bc} bg-gray-950 lg:grid-cols-2">
				<div class="p-8 sm:p-10 lg:p-14">
					<span class="text-smd mb-4 inline-block rounded-full bg-orange-900/30 px-4 py-1 font-semibold text-orange-400">Inference Providers</span>
					<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">Get 20× more Inference Usage</h2>
					<p class="text-lg text-gray-400">
						<a href="/docs/inference-providers" target="_blank" class="font-medium text-orange-400 hover:underline">Inference Providers</a>
						let you easily run inference on 10k+ models, while staying in control. You can manage API keys and sort your favorite
						providers without leaving the Hub.
						<br /><br />
						Hugging Face PRO provides <strong class="text-gray-200">20× more monthly inference usage</strong>, with additional pay-as-you-go
						option once your limit is reached.
					</p>
				</div>
				<div class="relative flex items-center justify-center overflow-hidden bg-orange-950/20 p-8 max-lg:order-first max-lg:pb-16 lg:p-12">
					<div class="w-full max-w-md space-y-4">
						<div class="rounded-xl bg-gray-800 p-5 shadow-sm">
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-4">Free Account</p>
							<div class="flex items-center gap-4">
								<div class="h-3 w-full rounded-full bg-gray-700"><div class="w-1/10 h-full rounded-full bg-gray-500"></div></div>
								<span class="font-mono text-sm text-gray-400">100k</span>
							</div>
						</div>
						<div class="flex items-center justify-center text-sm font-medium text-gray-400">VS</div>
						<div class="rounded-xl border-2 border-orange-500/20 bg-gray-800 p-5 shadow-sm">
							<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:mb-4">
								<span class="mr-2 inline-block -skew-x-12 rounded-md bg-orange-900/50 px-2 py-0.5 text-xs font-bold uppercase text-orange-300">PRO</span>
								Account
							</p>
							<div class="flex items-center gap-4">
								<div class="h-3 w-full rounded-full bg-orange-950/30"><div class="h-full w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"></div></div>
								<span class="font-mono text-sm font-medium text-orange-400">2M</span>
							</div>
						</div>
					</div>
					<div class="absolute -bottom-1 right-0 flex items-end text-sm text-gray-500 max-sm:left-0">
						<svg width="69" height="36" class="text-orange-500/6 flex-none max-sm:hidden" viewBox="0 0 69 36" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 36H69V0H64.8637C31.9331 0 27.4422 36 0 36Z" fill="currentColor" />
						</svg>
						<div class="bg-orange-500/6 flex h-[36px] items-center justify-center text-center max-md:rounded-t-xl max-sm:w-full">
							<div class="flex items-center pb-1 sm:-mx-2">
								<p class="mr-3"><span class="max-sm:hidden">Already </span>+15 providers available!</p>
								{#each visibleProviders as provider}
									<div class="mr-1 text-lg last:m-0" title={provider.prettyName}>
										<svelte:component this={provider.icon.default} name={provider.prettyName} />
									</div>
								{/each}
							</div>
						</div>
						<svg width="31" height="101" class="text-orange-500/6 flex-none max-sm:hidden" viewBox="0 0 31 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M30.6973 0.679688C30.6973 11.8666 30.9214 21.5101 30.6973 29.6748V100.974H0V64.9951C25.503 64.8999 30.0381 53.6787 30.6973 29.6748V0.679688Z" fill="currentColor" />
						</svg>
					</div>
				</div>
			</article>
		</section>

		<!-- ============ SPACER ============ -->
		<div class="w-full border-b {bc}">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>

		<!-- ============ COMMUNITY / PROFILE ============ -->
		<section class="w-full border-b {bc}">
			<article class="mx-auto grid max-w-7xl overflow-hidden border-l border-r {bc} bg-gray-950 lg:grid-cols-2">
				<div class="p-8 sm:p-10 lg:p-14">
					<span class="text-smd mb-4 inline-block rounded-full bg-pink-900/30 px-4 py-1 font-semibold text-pink-400">Community</span>
					<h2 class="mb-6 text-3xl font-bold text-white md:text-4xl">Share your AI Journey</h2>
					<p class="text-lg text-gray-400">
						The Hugging Face Hub is the central place to connect with the AI community, where AI builders and
						researchers share their work and build their profiles. <br /><br />
						Hugging Face PRO lets you showcase your work by <strong class="text-gray-200">writing and hosting Articles</strong> directly visible
						on your profile, and share updates with the community through short Posts.
					</p>
				</div>
				<div class="flex items-center justify-center bg-gradient-to-br from-pink-950/20 to-purple-950/20 max-lg:order-first">
					<img src="https://cdn-uploads.huggingface.co/production/uploads/5f17f0a0925b9863e28ad517/ftbPjbg87kFhkjEfafmqT.webp" alt="" class="aspect-square max-h-72 md:max-h-96" />
				</div>
			</article>
		</section>

		<!-- ============ SPACER ============ -->
		<div class="w-full border-b {bc}">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>

		<!-- ============ PREMIUM PERKS HEADER ============ -->
		<section class="w-full border-b {bc}">
			<div class="mx-auto flex max-w-7xl flex-col items-center justify-center border-l border-r {bc} bg-gray-950 px-6 py-10 text-center">
				<h2 class="text-3xl font-bold text-white md:text-4xl">Access more Premium Perks</h2>
				<p class="mt-1 text-xl text-gray-400">Extra features included with your PRO subscription</p>
			</div>
		</section>

		<!-- ============ PREMIUM PERKS GRID ============ -->
		<section class="w-full border-b {bc}">
			<div class="mx-auto grid max-w-7xl border-l border-r {bc} bg-gray-950 p-8 md:gap-10 lg:grid-cols-4 lg:p-14">
				<div>
					<div class="mb-3 flex size-9 items-center justify-center rounded-xl bg-blue-900/50 text-blue-400 sm:mb-4"><IconStorage /></div>
					<h3 class="mb-2.5 text-xl font-semibold text-white md:text-2xl">Public Storage Add-ons</h3>
					<p class="text-lg text-gray-400">Need more public storage? Purchase <a href="/docs/hub/storage-limits#storage-plans" target="_blank" class="font-medium text-blue-400 hover:underline">additional tiers</a> starting at <strong class="text-gray-200">$12/TB/month</strong>.</p>
				</div>
				<div>
					<div class="mb-3 flex size-9 items-center justify-center rounded-xl bg-red-900/50 text-red-400 sm:mb-4"><IconDataset /></div>
					<h3 class="mb-2.5 text-xl font-semibold text-white md:text-2xl">Private Dataset Viewer</h3>
					<p class="text-lg text-gray-400">Activate the <strong class="text-gray-200">Dataset Viewer on private datasets</strong> to keep your data safe and easy to explore.</p>
				</div>
				<div>
					<div class="mb-3 flex size-9 items-center justify-center rounded-xl bg-green-900/50 text-green-400 sm:mb-4"><IconCollection /></div>
					<h3 class="mb-2.5 text-xl font-semibold text-white md:text-2xl">Early Feature Access</h3>
					<p class="text-lg text-gray-400">Be among the first to <strong class="text-gray-200">try new features</strong> and stay ahead with the latest in open source AI.</p>
				</div>
				<div>
					<div class="mb-3 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/25 via-green-500/25 to-yellow-500/25 sm:mb-4"><IconSubscribeDisk /></div>
					<h3 class="mb-2.5 text-xl font-semibold text-white md:text-2xl">Exclusive PRO Badge</h3>
					<p class="text-lg text-gray-400"><strong class="text-gray-200">Show your support</strong> for Hugging Face and open source AI with a PRO badge on your profile.</p>
				</div>
			</div>
		</section>

		<!-- ============ SPACER ============ -->
		<div class="w-full border-b {bc}">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>

		<!-- ============ BOTTOM CTA ============ -->
		<section class="w-full border-b {bc}">
			<div class="hero-section relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden border-l border-r {bc} p-8 text-center max-sm:py-12 sm:p-12 lg:p-16">
				<h2 class="relative mb-3 text-4xl font-bold tracking-tight text-white xl:text-5xl">
					Ready to unlock Hugging Face
					<span class="relative inline-block">
						<span class="relative bg-clip-text font-bold text-transparent" style="background-image: linear-gradient(151deg, rgb(246,51,154) 15%, rgb(0,188,125) 50%, rgb(254,154,0) 100%); -webkit-background-clip: text;">PRO</span>
						<span class="absolute left-0 top-0 bg-clip-text font-bold text-transparent opacity-50 blur-xl" style="background-image: linear-gradient(151deg, rgb(246,51,154) 15%, rgb(0,188,125) 50%, rgb(254,154,0) 100%); -webkit-background-clip: text;">PRO</span>
					</span>?
				</h2>
				<p class="relative mb-6 text-xl text-gray-400 sm:text-2xl xl:mb-12">
					Join thousands of PRO users. Only $9/month. Cancel anytime.
				</p>
				<a
					href={subscribeUrl}
					class="relative z-1 flex w-fit items-center gap-2.5 whitespace-nowrap rounded-full bg-[#f3f4f6] px-6 py-2.5 text-xl text-black shadow-[0_0_0_4px_#0b0f19,0_0_0_5px_#f3f4f6] transition-all hover:bg-white"
				><span>→</span><span>Subscribe to HF PRO ($9/month)</span></a>
			</div>
		</section>

		<!-- ============ ORG SECTION ============ -->
		<section class="w-full border-b {bc}">
			<div class="mx-auto flex max-w-7xl flex-col items-center border-l border-r {bc} bg-gray-950 px-6 py-8 text-center">
				<h3 class="mb-2 text-xl font-semibold text-gray-300 sm:text-2xl">Part of an Organization on Hugging Face?</h3>
				<p class="mx-auto mb-4 text-lg text-gray-400">
					Subscribing to a <a href="/enterprise" class="underline-offset-6 font-semibold text-gray-300 underline decoration-gray-600 transition-all hover:decoration-gray-300">Team or Enterprise</a> plan automatically gives all team members ZeroGPU and Inference Providers PRO benefits.
				</p>
			</div>
		</section>

		<!-- ============ BOTTOM SPACER ============ -->
		<div class="w-full">
			<div class="mx-auto h-16 max-w-7xl border-l border-r {bc}"></div>
		</div>
	</div>
</App>

<style>
	.hero-section {
		background-color: transparent;
	}
	.icon-pill {
		background-color: transparent;
	}
	.icon-pill:hover {
		background-color: var(--hover-bg);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
</style>
