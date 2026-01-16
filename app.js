/**
 * PhotoStudio Pro v2.0
 * Professional Photo Editing Application
 * Performance optimized with proper curve rendering
 */

class PhotoStudio {
  constructor() {
    // Canvas elements
    this.canvas = document.getElementById("imageCanvas");
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });

    // State
    this.originalImage = null;
    this.currentImageData = null;
    this.zoom = 1;
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 30;
    this.isComparing = false;
    this.isProcessing = false;
    this.renderQueued = false;

    // Performance
    this.curveLUT = null;
    this.lastRenderTime = 0;

    // Adjustments
    this.adjustments = this.getDefaultAdjustments();

    // Initialize after DOM is ready
    this.init();
  }

  init() {
    this.initFilters();
    this.initFilms();
    this.initEventListeners();
    this.initSliders();

    // Initialize color cards and palette with delay to ensure DOM is ready
    requestAnimationFrame(() => {
      this.initColorCards();
      this.initCurveEditor();
      this.initColorPalette();
      this.initHSLSliders();
    });

    console.log("PhotoStudio Pro v2.0 initialized");
  }

  getDefaultAdjustments() {
    return {
      // Basic
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      // Color
      temperature: 0,
      tint: 0,
      vibrance: 0,
      saturation: 0,
      // Details
      clarity: 0,
      dehaze: 0,
      sharpen: 0,
      vignette: 0,
      grain: 0,
      // Preset
      intensity: 100,
      // HSL
      hsl: {
        red: { hue: 0, sat: 0, lum: 0 },
        orange: { hue: 0, sat: 0, lum: 0 },
        yellow: { hue: 0, sat: 0, lum: 0 },
        green: { hue: 0, sat: 0, lum: 0 },
        cyan: { hue: 0, sat: 0, lum: 0 },
        blue: { hue: 0, sat: 0, lum: 0 },
        purple: { hue: 0, sat: 0, lum: 0 },
        magenta: { hue: 0, sat: 0, lum: 0 },
      },
      // Curves
      curve: {
        rgb: [
          [0, 0],
          [255, 255],
        ],
        red: [
          [0, 0],
          [255, 255],
        ],
        green: [
          [0, 0],
          [255, 255],
        ],
        blue: [
          [0, 0],
          [255, 255],
        ],
      },
      // Split Toning
      highlightColor: "#ffaa00",
      highlightTone: 0,
      shadowColor: "#0066ff",
      shadowTone: 0,
      toneBalance: 0,
      // Color Palette
      paletteHue: 0,
      paletteSat: 0,
      wheelLightness: 50,
      selectedColorCard: null,
      // Preset
      presetIntensity: 100,
      currentPreset: null,
    };
  }

  // ==================== FILTERS ====================
  initFilters() {
    this.filters = [
      { id: "natural", name: "自然", settings: {} },
      {
        id: "vivid",
        name: "鲜艳",
        settings: { saturation: 25, vibrance: 20, contrast: 10 },
      },
      {
        id: "dramatic",
        name: "戏剧",
        settings: { contrast: 30, clarity: 25, saturation: 15, vignette: -20 },
      },
      {
        id: "moody",
        name: "情绪",
        settings: {
          contrast: 15,
          saturation: -15,
          temperature: -10,
          blacks: 15,
        },
      },
      {
        id: "warm",
        name: "暖调",
        settings: { temperature: 25, tint: 5, saturation: 10 },
      },
      {
        id: "cool",
        name: "冷调",
        settings: { temperature: -25, tint: -5, saturation: 5 },
      },
      {
        id: "fade",
        name: "褪色",
        settings: { contrast: -15, blacks: -25, saturation: -20 },
      },
      {
        id: "matte",
        name: "哑光",
        settings: { contrast: -10, blacks: -35, clarity: -10 },
      },
      {
        id: "retro",
        name: "复古",
        settings: { temperature: 15, saturation: -10, contrast: 10, grain: 15 },
      },
      {
        id: "cinematic",
        name: "电影",
        settings: {
          contrast: 20,
          saturation: -5,
          temperature: 5,
          vignette: -15,
        },
      },
      {
        id: "golden",
        name: "金色时光",
        settings: {
          temperature: 30,
          exposure: 5,
          saturation: 15,
          highlights: -10,
        },
      },
      {
        id: "arctic",
        name: "极地",
        settings: {
          temperature: -35,
          contrast: 15,
          clarity: 10,
          saturation: -10,
        },
      },
      {
        id: "noir",
        name: "黑色电影",
        settings: { saturation: -100, contrast: 35, clarity: 20 },
      },
      {
        id: "hdr",
        name: "HDR",
        settings: {
          clarity: 40,
          contrast: 20,
          shadows: 30,
          highlights: -20,
          vibrance: 25,
        },
      },
      {
        id: "sunset",
        name: "日落",
        settings: {
          temperature: 35,
          saturation: 20,
          exposure: 5,
          contrast: 10,
        },
      },
      {
        id: "forest",
        name: "森林",
        settings: {
          temperature: -10,
          saturation: 15,
          vibrance: 20,
          shadows: 15,
        },
      },
      {
        id: "urban",
        name: "都市",
        settings: {
          contrast: 25,
          clarity: 15,
          saturation: -10,
          temperature: -5,
        },
      },
      {
        id: "dream",
        name: "梦幻",
        settings: {
          contrast: -20,
          highlights: 20,
          saturation: 10,
          clarity: -25,
        },
      },
      {
        id: "chrome",
        name: "铬色",
        settings: { contrast: 30, saturation: -20, clarity: 25 },
      },
      {
        id: "sepia",
        name: "棕褐",
        settings: { saturation: -80, temperature: 30 },
      },
      {
        id: "polaroid",
        name: "拍立得",
        settings: {
          contrast: -5,
          saturation: -10,
          temperature: 8,
          blacks: -15,
        },
      },
      {
        id: "vintage",
        name: "老照片",
        settings: { saturation: -25, contrast: 5, temperature: 20, grain: 20 },
      },
    ];

    this.renderFilters();
  }

  renderFilters() {
    const grid = document.getElementById("filterGrid");
    if (!grid) return;

    grid.innerHTML = "";
    this.filters.forEach((filter) => {
      const card = document.createElement("div");
      card.className = "filter-card";
      card.dataset.filter = filter.id;
      card.innerHTML = `
                <div class="filter-preview" style="background: ${this.getFilterGradient(
                  filter
                )}"></div>
                <div class="filter-name">${filter.name}</div>
            `;
      card.addEventListener("click", () => this.applyFilter(filter));
      grid.appendChild(card);
    });
  }

  getFilterGradient(filter) {
    const s = filter.settings;
    const temp = s.temperature || 0;
    const sat = s.saturation || 0;
    const contrast = s.contrast || 0;

    let c1, c2;
    if (sat < -50) {
      c1 = "#555";
      c2 = "#222";
    } else if (temp > 15) {
      c1 = "#ffb347";
      c2 = "#ff6b35";
    } else if (temp < -15) {
      c1 = "#74b9ff";
      c2 = "#0984e3";
    } else if (contrast > 20) {
      c1 = "#2d3436";
      c2 = "#636e72";
    } else {
      c1 = "#6c5ce7";
      c2 = "#a29bfe";
    }
    return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
  }

  applyFilter(filter) {
    document
      .querySelectorAll(".filter-card")
      .forEach((c) => c.classList.remove("active"));
    document
      .querySelector(`[data-filter="${filter.id}"]`)
      ?.classList.add("active");

    // Apply filter settings
    Object.assign(this.adjustments, filter.settings);
    this.adjustments.currentPreset = filter;
    this.updateAllSliders();
    this.drawCurve();
    this.queueRender();
    this.saveHistory(`应用滤镜: ${filter.name}`);
  }

  // ==================== FILM PRESETS ====================
  initFilms() {
    this.films = {
      fuji: [
        {
          id: "velvia50",
          name: "Velvia 50",
          settings: { saturation: 40, contrast: 25, vibrance: 30 },
          category: "film",
        },
        {
          id: "velvia100",
          name: "Velvia 100",
          settings: { saturation: 35, contrast: 20, vibrance: 25 },
          category: "film",
        },
        {
          id: "provia100f",
          name: "Provia 100F",
          settings: { saturation: 10, contrast: 15 },
          category: "film",
        },
        {
          id: "astia100f",
          name: "Astia 100F",
          settings: { saturation: -5, contrast: 5, highlights: -10 },
          category: "film",
        },
        {
          id: "pro400h",
          name: "Pro 400H",
          settings: { saturation: -10, temperature: -5, highlights: 10 },
          category: "film",
        },
        {
          id: "superia400",
          name: "Superia 400",
          settings: { saturation: 15, temperature: 5, contrast: 10 },
          category: "film",
        },
        {
          id: "superia1600",
          name: "Superia 1600",
          settings: { saturation: 10, contrast: 15, grain: 20 },
          category: "film",
        },
        {
          id: "c200",
          name: "C200",
          settings: { saturation: 10, temperature: 8, contrast: 5 },
          category: "film",
        },
        {
          id: "classicchrome",
          name: "Classic Chrome",
          settings: { saturation: -15, contrast: 20, temperature: 5 },
          category: "film",
        },
        {
          id: "acros",
          name: "Acros",
          settings: { saturation: -100, contrast: 25, clarity: 15 },
          category: "bw",
        },
        {
          id: "eterna",
          name: "Eterna",
          settings: { saturation: -20, contrast: -10, temperature: -5 },
          category: "film",
        },
        {
          id: "nostalgicneg",
          name: "Nostalgic Neg",
          settings: {
            saturation: -5,
            temperature: 15,
            contrast: -5,
            highlights: 10,
          },
          category: "film",
        },
      ],
      kodak: [
        {
          id: "portra160",
          name: "Portra 160",
          settings: {
            saturation: -5,
            temperature: 5,
            contrast: -5,
            highlights: 5,
          },
          category: "film",
        },
        {
          id: "portra400",
          name: "Portra 400",
          settings: { saturation: -8, temperature: 8, contrast: -5 },
          category: "film",
        },
        {
          id: "portra800",
          name: "Portra 800",
          settings: { saturation: -5, temperature: 10, contrast: 5, grain: 10 },
          category: "film",
        },
        {
          id: "ektar100",
          name: "Ektar 100",
          settings: { saturation: 25, contrast: 15, vibrance: 20 },
          category: "film",
        },
        {
          id: "gold200",
          name: "Gold 200",
          settings: { saturation: 15, temperature: 15, contrast: 10 },
          category: "film",
        },
        {
          id: "ultramax400",
          name: "UltraMax 400",
          settings: { saturation: 20, temperature: 10, contrast: 12 },
          category: "film",
        },
        {
          id: "colorplus200",
          name: "ColorPlus 200",
          settings: { saturation: 12, temperature: 12, contrast: 8 },
          category: "film",
        },
        {
          id: "ektachrome100",
          name: "Ektachrome E100",
          settings: { saturation: 20, contrast: 18, vibrance: 15 },
          category: "film",
        },
        {
          id: "kodachrome64",
          name: "Kodachrome 64",
          settings: {
            saturation: 25,
            contrast: 20,
            temperature: 5,
            vibrance: 20,
          },
          category: "film",
        },
        {
          id: "trix400",
          name: "Tri-X 400",
          settings: { saturation: -100, contrast: 30, clarity: 20, grain: 15 },
          category: "bw",
        },
        {
          id: "tmax100",
          name: "T-Max 100",
          settings: { saturation: -100, contrast: 25, clarity: 15 },
          category: "bw",
        },
        {
          id: "tmax400",
          name: "T-Max 400",
          settings: { saturation: -100, contrast: 28, clarity: 18, grain: 10 },
          category: "bw",
        },
      ],
      hasselblad: [
        {
          id: "hb_natural",
          name: "Natural",
          settings: { saturation: 5, contrast: 5 },
          category: "film",
        },
        {
          id: "hb_portrait",
          name: "Portrait",
          settings: { saturation: -5, temperature: 5, highlights: -10 },
          category: "film",
        },
        {
          id: "hb_landscape",
          name: "Landscape",
          settings: { saturation: 15, clarity: 10, vibrance: 15 },
          category: "film",
        },
        {
          id: "hb_vibrant",
          name: "Vibrant",
          settings: { saturation: 25, vibrance: 20, contrast: 10 },
          category: "film",
        },
        {
          id: "hb_soft",
          name: "Soft",
          settings: { contrast: -15, clarity: -10, highlights: 10 },
          category: "film",
        },
        {
          id: "hb_xpan",
          name: "XPAN",
          settings: { contrast: 20, saturation: -10, clarity: 15 },
          category: "film",
        },
        {
          id: "hb_highcontrast",
          name: "High Contrast",
          settings: { contrast: 35, clarity: 20, blacks: 10 },
          category: "film",
        },
        {
          id: "hb_bwclassic",
          name: "B&W Classic",
          settings: { saturation: -100, contrast: 25, clarity: 10 },
          category: "bw",
        },
      ],
      ilford: [
        {
          id: "hp5plus",
          name: "HP5 Plus 400",
          settings: { saturation: -100, contrast: 25, clarity: 15, grain: 12 },
          category: "bw",
        },
        {
          id: "delta100",
          name: "Delta 100",
          settings: { saturation: -100, contrast: 30, clarity: 20 },
          category: "bw",
        },
        {
          id: "delta400",
          name: "Delta 400",
          settings: { saturation: -100, contrast: 28, clarity: 18, grain: 10 },
          category: "bw",
        },
        {
          id: "delta3200",
          name: "Delta 3200",
          settings: { saturation: -100, contrast: 22, grain: 25 },
          category: "bw",
        },
        {
          id: "fp4plus",
          name: "FP4 Plus 125",
          settings: { saturation: -100, contrast: 28, clarity: 18 },
          category: "bw",
        },
        {
          id: "panfplus",
          name: "Pan F Plus 50",
          settings: { saturation: -100, contrast: 32, clarity: 22 },
          category: "bw",
        },
        {
          id: "sfx200",
          name: "SFX 200",
          settings: {
            saturation: -100,
            contrast: 35,
            highlights: 15,
            shadows: -15,
          },
          category: "bw",
        },
        {
          id: "xp2super",
          name: "XP2 Super",
          settings: { saturation: -100, contrast: 20, clarity: 12 },
          category: "bw",
        },
      ],
      agfa: [
        {
          id: "vista200",
          name: "Vista 200",
          settings: { saturation: 18, temperature: 8, contrast: 10 },
          category: "film",
        },
        {
          id: "vista400",
          name: "Vista 400",
          settings: { saturation: 20, temperature: 10, contrast: 12, grain: 8 },
          category: "film",
        },
        {
          id: "ultra50",
          name: "Ultra 50",
          settings: { saturation: 35, contrast: 20, vibrance: 25 },
          category: "film",
        },
        {
          id: "ultra100",
          name: "Ultra 100",
          settings: { saturation: 30, contrast: 18, vibrance: 22 },
          category: "film",
        },
        {
          id: "optima100",
          name: "Optima 100",
          settings: { saturation: 15, contrast: 12 },
          category: "film",
        },
        {
          id: "precisa100",
          name: "Precisa CT100",
          settings: { saturation: 22, contrast: 18, vibrance: 18 },
          category: "film",
        },
        {
          id: "scala200",
          name: "Scala 200",
          settings: { saturation: -100, contrast: 28, clarity: 15 },
          category: "bw",
        },
        {
          id: "apx100",
          name: "APX 100",
          settings: { saturation: -100, contrast: 30, clarity: 18 },
          category: "bw",
        },
        {
          id: "apx400",
          name: "APX 400",
          settings: { saturation: -100, contrast: 26, clarity: 15, grain: 12 },
          category: "bw",
        },
      ],
      cinematic: [
        {
          id: "vision3_50d",
          name: "Vision3 50D",
          settings: { saturation: 10, contrast: 12, temperature: -5 },
          category: "film",
        },
        {
          id: "vision3_250d",
          name: "Vision3 250D",
          settings: { saturation: 8, contrast: 10, temperature: 5 },
          category: "film",
        },
        {
          id: "vision3_500t",
          name: "Vision3 500T",
          settings: { saturation: 5, contrast: 8, temperature: -10 },
          category: "film",
        },
        {
          id: "cinestill800t",
          name: "CineStill 800T",
          settings: {
            saturation: 15,
            temperature: -15,
            highlights: 15,
            grain: 10,
          },
          category: "film",
        },
        {
          id: "cinestill50d",
          name: "CineStill 50D",
          settings: { saturation: 12, contrast: 15, vibrance: 10 },
          category: "film",
        },
        {
          id: "tealorange",
          name: "Teal & Orange",
          settings: {
            temperature: 20,
            tint: -10,
            saturation: 15,
            contrast: 15,
          },
          category: "film",
        },
        {
          id: "bleachbypass",
          name: "Bleach Bypass",
          settings: { saturation: -40, contrast: 35, clarity: 20 },
          category: "film",
        },
        {
          id: "crossprocess",
          name: "Cross Process",
          settings: { saturation: 20, temperature: 15, tint: 15, contrast: 20 },
          category: "film",
        },
        {
          id: "technicolor",
          name: "Technicolor",
          settings: { saturation: 30, contrast: 25, vibrance: 25 },
          category: "film",
        },
        {
          id: "desaturated",
          name: "Desaturated",
          settings: { saturation: -30, contrast: 15, clarity: 10 },
          category: "film",
        },
      ],
      lomo: [
        {
          id: "lomo100",
          name: "Color 100",
          settings: { saturation: 25, contrast: 20, vignette: -25 },
          category: "film",
        },
        {
          id: "lomo400",
          name: "Color 400",
          settings: { saturation: 30, contrast: 25, vignette: -30, grain: 15 },
          category: "film",
        },
        {
          id: "lomopurple",
          name: "Purple",
          settings: { saturation: 20, tint: 30, contrast: 15, vignette: -20 },
          category: "film",
        },
        {
          id: "lomoturquoise",
          name: "Turquoise",
          settings: {
            saturation: 20,
            temperature: -20,
            tint: -15,
            vignette: -20,
          },
          category: "film",
        },
        {
          id: "lomoRedscale",
          name: "Redscale",
          settings: {
            temperature: 40,
            saturation: 30,
            contrast: 20,
            vignette: -25,
          },
          category: "film",
        },
        {
          id: "lomoearlgrey",
          name: "Earl Grey",
          settings: {
            saturation: -100,
            contrast: 15,
            vignette: -30,
            grain: 20,
          },
          category: "bw",
        },
      ],
      polaroid: [
        {
          id: "sx70",
          name: "SX-70",
          settings: {
            saturation: -10,
            temperature: 10,
            contrast: -10,
            blacks: -20,
          },
          category: "film",
        },
        {
          id: "spectra",
          name: "Spectra",
          settings: {
            saturation: 5,
            temperature: 5,
            contrast: -5,
            blacks: -15,
          },
          category: "film",
        },
        {
          id: "polaroid600",
          name: "600",
          settings: {
            saturation: 10,
            temperature: 8,
            contrast: 5,
            blacks: -10,
          },
          category: "film",
        },
        {
          id: "itype",
          name: "i-Type",
          settings: { saturation: 15, contrast: 10, vibrance: 10 },
          category: "film",
        },
      ],
    };

    this.renderFilms();
  }

  renderFilms() {
    const grids = {
      fuji: document.getElementById("fujiGrid"),
      kodak: document.getElementById("kodakGrid"),
      hasselblad: document.getElementById("hasselbladGrid"),
      ilford: document.getElementById("ilfordGrid"),
      agfa: document.getElementById("agfaGrid"),
      cinematic: document.getElementById("cinematicGrid"),
      lomo: document.getElementById("lomoGrid"),
      polaroid: document.getElementById("polaroidGrid"),
    };

    Object.entries(this.films).forEach(([brand, films]) => {
      const grid = grids[brand];
      if (!grid) return;

      grid.innerHTML = "";
      films.forEach((film) => {
        const card = document.createElement("div");
        card.className = "film-card";
        card.dataset.film = film.id;
        card.dataset.category = film.category;
        card.innerHTML = `
                    <div class="film-preview" style="background: ${this.getFilmGradient(
                      film
                    )}"></div>
                    <div class="film-name">${film.name}</div>
                `;
        card.addEventListener("click", () => this.applyFilm(film));
        grid.appendChild(card);
      });
    });
  }

  getFilmGradient(film) {
    const s = film.settings;
    if (s.saturation <= -80) {
      const c = s.contrast > 25 ? 30 : 50;
      return `linear-gradient(135deg, rgb(${c},${c},${c}) 0%, rgb(${c + 30},${
        c + 30
      },${c + 30}) 100%)`;
    }
    const temp = s.temperature || 0;
    const sat = s.saturation || 0;

    if (temp > 15) return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
    if (temp < -10) return "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)";
    if (sat > 20) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    return "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)";
  }

  applyFilm(film) {
    document
      .querySelectorAll(".film-card")
      .forEach((c) => c.classList.remove("active"));
    document.querySelector(`[data-film="${film.id}"]`)?.classList.add("active");
    document
      .querySelectorAll(".filter-card")
      .forEach((c) => c.classList.remove("active"));

    // Apply film settings
    Object.assign(this.adjustments, film.settings);
    this.adjustments.currentPreset = film;
    this.updateAllSliders();
    this.drawCurve();
    this.queueRender();
    this.saveHistory(`应用胶片: ${film.name}`);
  }

  // ==================== COLOR PALETTE ====================
  initColorPalette() {
    // Initialize color palette UI
    const canvas = document.getElementById("colorWheelCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let isDragging = false;

    // Add color wheel interaction
    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      this.selectColorAtPosition(e, canvas);
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        this.selectColorAtPosition(e, canvas);
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
      isDragging = false;
    });

    // Touch support for mobile devices
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      isDragging = true;
      this.selectColorAtPosition(e.touches[0], canvas);
    });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (isDragging) {
        this.selectColorAtPosition(e.touches[0], canvas);
      }
    });

    canvas.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Draw color wheel
    this.drawColorWheel();

    // Set initial color preview
    this.updateColorPreview([255, 87, 51]); // Default color: #FF5733
  }

  selectColorAtPosition(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Get color from wheel
    const color = this.getColorFromWheel(x, y, canvas.width, canvas.height);
    if (color) {
      // Update color indicator position
      this.updateColorIndicatorPosition(x, y, canvas.width, canvas.height);

      // Select color from wheel
      this.selectColorFromWheel(color);
    }
  }

  updateColorIndicatorPosition(x, y, width, height) {
    const indicator = document.getElementById("colorIndicator");
    if (indicator) {
      // Calculate percentage position relative to canvas
      const percentX = (x / width) * 100;
      const percentY = (y / height) * 100;

      // Update indicator position
      indicator.style.left = `${percentX}%`;
      indicator.style.top = `${percentY}%`;
    }
  }

  // ==================== COLOR CARDS (HUAWEI STYLE) ====================
  initColorCards() {
    this.colorCards = [
      // Warm tones
      {
        id: "coral",
        name: "珊瑚",
        color: "#FF6B6B",
        settings: { temperature: 20, saturation: 15, tint: 5 },
      },
      {
        id: "peach",
        name: "蜜桃",
        color: "#FFAB91",
        settings: { temperature: 25, saturation: 10 },
      },
      {
        id: "orange",
        name: "金橙",
        color: "#FF9F43",
        settings: { temperature: 30, saturation: 20 },
      },
      {
        id: "amber",
        name: "琥珀",
        color: "#F0932B",
        settings: { temperature: 35, saturation: 15, contrast: 5 },
      },
      // Cool tones
      {
        id: "mint",
        name: "薄荷",
        color: "#00D2D3",
        settings: { temperature: -20, saturation: 15, tint: -10 },
      },
      {
        id: "celadon",
        name: "青瓷",
        color: "#81ECEC",
        settings: { temperature: -15, saturation: 10 },
      },
      {
        id: "skyblue",
        name: "天蓝",
        color: "#74B9FF",
        settings: { temperature: -25, saturation: 12 },
      },
      {
        id: "indigo",
        name: "靛蓝",
        color: "#5F27CD",
        settings: { temperature: -30, saturation: 20, tint: 10 },
      },
      // Nature tones
      {
        id: "forest",
        name: "森林",
        color: "#2ECC71",
        settings: { temperature: -10, saturation: 18, vibrance: 15 },
      },
      {
        id: "olive",
        name: "橄榄",
        color: "#A3CB38",
        settings: { temperature: 5, saturation: 10, vibrance: 10 },
      },
      {
        id: "desert",
        name: "沙漠",
        color: "#E1B12C",
        settings: { temperature: 28, saturation: 8, contrast: 10 },
      },
      {
        id: "earth",
        name: "大地",
        color: "#795548",
        settings: { temperature: 20, saturation: -15, contrast: 8 },
      },
      // Mood tones
      {
        id: "lavender",
        name: "薰衣草",
        color: "#A29BFE",
        settings: { temperature: -5, saturation: 5, tint: 15 },
      },
      {
        id: "rose",
        name: "玫瑰",
        color: "#FD79A8",
        settings: { temperature: 10, saturation: 15, tint: 20 },
      },
      {
        id: "smoke",
        name: "烟灰",
        color: "#636E72",
        settings: { saturation: -30, contrast: 10 },
      },
      {
        id: "midnight",
        name: "午夜",
        color: "#2D3436",
        settings: {
          temperature: -15,
          saturation: -20,
          contrast: 20,
          blacks: 15,
        },
      },
    ];

    this.renderColorCards();
  }

  renderColorCards() {
    const grid = document.getElementById("colorCardsGrid");
    if (!grid) return;

    grid.innerHTML = "";
    this.colorCards.forEach((card) => {
      const el = document.createElement("div");
      el.className = "color-card";
      el.dataset.card = card.id;
      el.style.background = card.color;
      el.innerHTML = `<span class="color-card-name">${card.name}</span>`;
      el.addEventListener("click", () => this.applyColorCard(card));
      grid.appendChild(el);
    });
  }

  applyColorCard(card) {
    document
      .querySelectorAll(".color-card")
      .forEach((c) => c.classList.remove("active"));
    document.querySelector(`[data-card="${card.id}"]`)?.classList.add("active");

    // Apply color card settings
    Object.assign(this.adjustments, card.settings);
    this.adjustments.selectedColorCard = card;
    this.updateAllSliders();
    this.drawCurve();
    this.queueRender();
    this.saveHistory(`应用色卡: ${card.name}`);
  }

  // ==================== EVENT LISTENERS ====================
  initEventListeners() {
    // File input
    const fileInput = document.getElementById("fileInput");
    const overlay = document.getElementById("canvasOverlay");

    overlay?.addEventListener("click", () => fileInput?.click());
    fileInput?.addEventListener("change", (e) =>
      this.handleFile(e.target.files[0])
    );

    // Drag and drop
    const wrapper = document.getElementById("canvasWrapper");
    if (wrapper) {
      wrapper.addEventListener("dragover", (e) => {
        e.preventDefault();
        wrapper.classList.add("dragover");
      });

      wrapper.addEventListener("dragleave", (e) => {
        e.preventDefault();
        wrapper.classList.remove("dragover");
      });

      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        wrapper.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.handleFile(files[0]);
        }
      });
    }

    // Zoom controls
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const zoomResetBtn = document.getElementById("zoomReset");

    zoomInBtn?.addEventListener("click", () => this.setZoom(this.zoom * 1.2));
    zoomOutBtn?.addEventListener("click", () => this.setZoom(this.zoom / 1.2));
    zoomResetBtn?.addEventListener("click", () => this.fitToView());

    // Compare toggle
    const compareToggle = document.getElementById("compareToggle");
    compareToggle?.addEventListener("click", () => this.toggleCompare());

    // Undo/Redo
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");

    undoBtn?.addEventListener("click", () => this.undo());
    redoBtn?.addEventListener("click", () => this.redo());

    // Export
    const exportBtn = document.getElementById("exportBtn");
    exportBtn?.addEventListener("click", () => this.exportImage());

    // Reset buttons
    const resetAllBtn = document.getElementById("resetAll");
    const resetBasicBtn = document.getElementById("resetBasic");
    const resetCurveBtn = document.getElementById("resetCurve");
    const resetHSLBtn = document.getElementById("resetHSL");
    const resetSplitBtn = document.getElementById("resetSplit");
    const resetPaletteBtn = document.getElementById("resetPalette");

    resetAllBtn?.addEventListener("click", () => this.resetAll());
    resetBasicBtn?.addEventListener("click", () => this.resetBasic());
    resetCurveBtn?.addEventListener("click", () => this.resetCurve());
    resetHSLBtn?.addEventListener("click", () => this.resetHSL());
    resetSplitBtn?.addEventListener("click", () => this.resetSplitToning());
    resetPaletteBtn?.addEventListener("click", () => this.resetPalette());

    // Category filters
    const categoryFilters = document.querySelectorAll(".category-filter");
    categoryFilters.forEach((filter) => {
      filter.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        this.filterPresets(category);
      });
    });

    // Search
    const searchInput = document.getElementById("presetSearch");
    searchInput?.addEventListener("input", (e) => {
      this.searchPresets(e.target.value);
    });

    // Intensity slider
    const intensitySlider = document.querySelector('[data-slider="intensity"]');
    if (intensitySlider) {
      this.initSlider(intensitySlider, "intensity", (value) => {
        this.adjustments.intensity = value;
        this.queueRender();
      });
    }

    // Split toning color pickers
    const highlightPicker = document.getElementById("highlightColor");
    const shadowPicker = document.getElementById("shadowColor");

    highlightPicker?.addEventListener("input", (e) => {
      this.adjustments.splitToning.highlight = e.target.value;
      this.queueRender();
    });

    shadowPicker?.addEventListener("input", (e) => {
      this.adjustments.splitToning.shadow = e.target.value;
      this.queueRender();
    });

    // Collapsible sections
    const collapsibles = document.querySelectorAll(".collapsible");
    collapsibles.forEach((collapsible) => {
      collapsible.addEventListener("click", () => {
        collapsible.classList.toggle("active");
        const content = collapsible.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    });

    // HSL tabs
    const hslTabs = document.querySelectorAll(".hsl-tab");
    hslTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const target = e.target.dataset.target;
        this.switchHSLTab(target);
      });
    });

    // Mobile panel toggles
    const leftToggle = document.getElementById("leftPanelToggle");
    const rightToggle = document.getElementById("rightPanelToggle");

    leftToggle?.addEventListener("click", () => this.togglePanel("left"));
    rightToggle?.addEventListener("click", () => this.togglePanel("right"));

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            this.undo();
            break;
          case "y":
            e.preventDefault();
            this.redo();
            break;
          case "s":
            e.preventDefault();
            this.exportImage();
            break;
          case "0":
            e.preventDefault();
            this.fitToView();
            break;
        }
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.initCurveEditor();
        this.initColorPalette();
      }, 100);
    });

    // Color wheel events
    this.initColorWheelEvents();

    // Initialize sliders
    this.initSliders();
  }

  initColorWheelEvents() {
    const canvas = document.getElementById("colorWheelCanvas");
    if (!canvas) return;

    let isDragging = false;

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rgb = this.getColorFromWheel(x, y, canvas.width, canvas.height);
      if (rgb) {
        // Update color indicator position
        this.updateColorIndicatorPosition(x, y, canvas.width, canvas.height);
        this.selectColorFromWheel(rgb);
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rgb = this.getColorFromWheel(x, y, canvas.width, canvas.height);
      if (rgb) {
        // Update cursor preview
        canvas.style.cursor = "crosshair";

        // Update color indicator position while dragging
        if (isDragging) {
          this.updateColorIndicatorPosition(x, y, canvas.width, canvas.height);
          this.selectColorFromWheel(rgb);
        }
      } else {
        canvas.style.cursor = "default";
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
      isDragging = false;
    });
  }

  // ==================== MISSING METHODS ====================
  initCurveEditor() {
    // Initialize curve editor UI
    const canvas = document.getElementById("curveCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Initialize curve channel selection
    this.currentCurveChannel = "rgb";

    // Initialize curve needs update flag
    this.curveNeedsUpdate = true;

    // Add channel selection event listeners
    document.querySelectorAll(".curve-preset[data-curve]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".curve-preset[data-curve]")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCurveChannel = btn.dataset.curve;
        this.drawCurve();
      });
    });

    // Add preset selection event listeners
    document.querySelectorAll(".curve-preset[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.applyCurvePreset(btn.dataset.preset);
      });
    });

    // Add mouse event listeners for curve editing
    this.isDragging = false;
    this.selectedPoint = -1;
    this.originalPointIndex = -1;

    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicked on a point (larger hit area - 15 pixels)
      const points = this.adjustments.curve[this.currentCurveChannel];
      let closestPointIndex = -1;
      let minDistance = 20; // Increased hit radius for better selection

      for (let i = 0; i < points.length; i++) {
        const pointX = (points[i][0] / 255) * canvas.width;
        const pointY = canvas.height - (points[i][1] / 255) * canvas.height;
        const distance = Math.sqrt(
          Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestPointIndex = i;
        }
      }

      if (closestPointIndex !== -1) {
        this.isDragging = true;
        this.selectedPoint = closestPointIndex;
        this.originalPointIndex = closestPointIndex;
        this.drawCurve(); // Redraw to show selected point
      } else {
        // Add new point only if not near existing points
        const newX = Math.round((x / canvas.width) * 255);
        const newY = Math.round(((canvas.height - y) / canvas.height) * 255);

        // Check if new point is too close to existing points (avoid duplicates)
        let tooClose = false;
        for (let i = 0; i < points.length; i++) {
          const pointX = points[i][0];
          const pointY = points[i][1];
          const distance = Math.sqrt(
            Math.pow(newX - pointX, 2) + Math.pow(newY - pointY, 2)
          );
          if (distance < 10) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          // Add new point
          points.push([newX, newY]);

          // Sort points
          points.sort((a, b) => a[0] - b[0]);

          // Find the new index after sorting
          this.selectedPoint = points.findIndex(
            (p) => p[0] === newX && p[1] === newY
          );
          this.originalPointIndex = this.selectedPoint;
          this.isDragging = true;

          this.curveNeedsUpdate = true;
          this.drawCurve();
          this.queueRender();
        }
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging || this.selectedPoint === -1) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(canvas.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(canvas.height, e.clientY - rect.top));

      // Update point position
      const points = this.adjustments.curve[this.currentCurveChannel];
      const newX = Math.round((x / canvas.width) * 255);
      const newY = Math.round(((canvas.height - y) / canvas.height) * 255);

      // Update point coordinates
      points[this.selectedPoint][0] = newX;
      points[this.selectedPoint][1] = newY;

      // Only sort when dragging ends (to avoid index confusion during drag)
      // But ensure first and last points stay at boundaries
      if (this.selectedPoint === 0) {
        points[this.selectedPoint][0] = 0; // First point stays at x=0
      } else if (this.selectedPoint === points.length - 1) {
        points[this.selectedPoint][0] = 255; // Last point stays at x=255
      }

      this.curveNeedsUpdate = true;
      this.drawCurve();
      this.queueRender();
    });

    canvas.addEventListener("mouseup", () => {
      if (this.isDragging && this.selectedPoint !== -1) {
        // Sort points after dragging ends
        const points = this.adjustments.curve[this.currentCurveChannel];
        points.sort((a, b) => a[0] - b[0]);

        // Update selected point index after sorting
        if (this.originalPointIndex !== -1) {
          // Find the moved point in the sorted array
          const movedPoint = points.find(
            (p) =>
              Math.abs(p[0] - points[this.originalPointIndex][0]) < 1 &&
              Math.abs(p[1] - points[this.originalPointIndex][1]) < 1
          );
          if (movedPoint) {
            this.selectedPoint = points.indexOf(movedPoint);
          }
        }

        this.saveHistory("调整曲线点");
      }

      this.isDragging = false;
      this.selectedPoint = -1;
      this.originalPointIndex = -1;
      this.drawCurve(); // Redraw to clear selection highlight
    });

    canvas.addEventListener("mouseleave", () => {
      if (this.isDragging && this.selectedPoint !== -1) {
        // Sort points when leaving canvas during drag
        const points = this.adjustments.curve[this.currentCurveChannel];
        points.sort((a, b) => a[0] - b[0]);
        this.saveHistory("调整曲线点");
      }

      this.isDragging = false;
      this.selectedPoint = -1;
      this.originalPointIndex = -1;
      this.drawCurve(); // Redraw to clear selection highlight
    });

    // Add double-click to delete point
    canvas.addEventListener("dblclick", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const points = this.adjustments.curve[this.currentCurveChannel];

      // Find point to delete
      for (let i = 0; i < points.length; i++) {
        const pointX = (points[i][0] / 255) * canvas.width;
        const pointY = canvas.height - (points[i][1] / 255) * canvas.height;
        const distance = Math.sqrt(
          Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2)
        );

        if (distance < 8 && i > 0 && i < points.length - 1) {
          // Delete point (but not first or last point)
          points.splice(i, 1);
          this.curveNeedsUpdate = true;
          this.drawCurve();
          this.queueRender();
          break;
        }
      }
    });

    this.drawCurve();
  }

  drawCurve() {
    // Draw curve on canvas
    const canvas = document.getElementById("curveCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const pos = (canvas.width / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // Draw diagonal line
    ctx.strokeStyle = "#444";
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();

    // Define channel colors
    const colors = {
      rgb: "#ffffff",
      red: "#ef4444",
      green: "#22c55e",
      blue: "#3b82f6",
    };

    // Draw all curves with different colors
    const channels = ["rgb", "red", "green", "blue"];
    channels.forEach((channel) => {
      const points = this.adjustments.curve[channel];

      // Set curve style
      ctx.strokeStyle = colors[channel];
      ctx.lineWidth = this.currentCurveChannel === channel ? 3 : 1;
      ctx.setLineDash(this.currentCurveChannel === channel ? [] : [5, 5]);
      ctx.beginPath();

      // Draw curve
      for (let x = 0; x < 256; x++) {
        const y = this.interpolateCurve(points, x);
        const px = (x / 255) * canvas.width;
        const py = canvas.height - (y / 255) * canvas.height;

        if (x === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw points for current channel
      if (this.currentCurveChannel === channel) {
        points.forEach(([x, y], index) => {
          const px = (x / 255) * canvas.width;
          const py = canvas.height - (y / 255) * canvas.height;

          // Highlight selected point
          if (index === this.selectedPoint && this.isDragging) {
            // Draw selection highlight (larger outer circle)
            ctx.fillStyle = "#ffff00";
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw outer circle
          ctx.fillStyle = colors[channel];
          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fill();

          // Draw inner circle
          ctx.fillStyle = "#1a1a1a";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    });
  }

  handleFile(file) {
    if (!file || !file.type.match("image.*")) {
      alert("请选择有效的图片文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        this.originalImage = img;
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.currentImageData = this.ctx.getImageData(
          0,
          0,
          img.width,
          img.height
        );
        this.zoom = 1;
        this.history = [];
        this.historyIndex = -1;
        this.adjustments = this.getDefaultAdjustments();
        this.updateAllSliders();
        this.drawCurve();
        this.saveHistory("加载图片");

        // Hide overlay
        const overlay = document.getElementById("canvasOverlay");
        if (overlay) overlay.style.display = "none";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ==================== RENDERING ====================
  queueRender() {
    if (this.isProcessing) {
      this.renderQueued = true;
      return;
    }

    this.isProcessing = true;
    requestAnimationFrame(() => {
      this.render();
      this.isProcessing = false;
      if (this.renderQueued) {
        this.renderQueued = false;
        this.queueRender();
      }
    });
  }

  render() {
    if (!this.originalImage) return;

    // Handle compare mode
    if (this.isComparing) {
      this.showComparison();
      return;
    }

    const now = Date.now();
    if (now - this.lastRenderTime < 16) {
      // ~60fps throttle
      this.renderQueued = true;
      return;
    }

    this.lastRenderTime = now;

    // Copy original image data
    const imageData = new ImageData(
      new Uint8ClampedArray(this.currentImageData.data),
      this.currentImageData.width,
      this.currentImageData.height
    );

    // Apply adjustments
    this.applyAllAdjustments(imageData);

    // Draw to canvas
    this.ctx.putImageData(imageData, 0, 0);

    // Apply zoom
    this.setZoom(this.zoom);
  }

  setZoom(zoom) {
    if (!this.originalImage) return;

    this.zoom = Math.max(0.1, Math.min(10, zoom));
    const img = this.originalImage;

    // Update canvas size
    this.canvas.style.width = `${img.width * this.zoom}px`;
    this.canvas.style.height = `${img.height * this.zoom}px`;

    // Update zoom display
    const zoomDisplay = document.getElementById("zoomValue");
    if (zoomDisplay)
      zoomDisplay.textContent = `${Math.round(this.zoom * 100)}%`;
  }

  fitToView() {
    if (!this.originalImage) return;

    const wrapper = document.getElementById("canvasWrapper");
    if (!wrapper) return;

    const wrapperWidth = wrapper.clientWidth - 40;
    const wrapperHeight = wrapper.clientHeight - 40;
    const img = this.originalImage;

    const scaleX = wrapperWidth / img.width;
    const scaleY = wrapperHeight / img.height;
    const scale = Math.min(scaleX, scaleY, 1);

    this.setZoom(scale);
  }

  // ==================== PRESET FILTERING ====================
  filterPresets(category) {
    document.querySelectorAll(".film-card").forEach((card) => {
      if (category === "all" || card.dataset.category === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchPresets(query) {
    const cards = document.querySelectorAll(".film-card, .filter-card");
    cards.forEach((card) => {
      const name = card
        .querySelector(".film-name, .filter-name")
        ?.textContent.toLowerCase();
      if (name && name.includes(query.toLowerCase())) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  drawColorWheel() {
    const canvas = document.getElementById("colorWheelCanvas");
    if (!canvas) return;

    // 设置高分辨率渲染
    const scale = 3; // 3倍分辨率抗锯齿
    const width = canvas.width;
    const height = canvas.height;

    // 创建离屏canvas用于高质量渲染
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width * scale;
    offscreenCanvas.height = height * scale;
    const ctx = offscreenCanvas.getContext("2d");

    const centerX = offscreenCanvas.width / 2;
    const centerY = offscreenCanvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10 * scale;

    ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Get current lightness value from slider or use default
    const lightness = (this.adjustments.wheelLightness || 50) / 100;

    // 使用更高效的抗锯齿算法
    const imageData = ctx.createImageData(
      offscreenCanvas.width,
      offscreenCanvas.height
    );
    const data = imageData.data;

    for (let y = 0; y < offscreenCanvas.height; y++) {
      for (let x = 0; x < offscreenCanvas.width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
          const saturation = distance / radius;

          const color = this.hslToRgb(angle, saturation, lightness);
          const index = (y * offscreenCanvas.width + x) * 4;

          data[index] = color[0]; // R
          data[index + 1] = color[1]; // G
          data[index + 2] = color[2]; // B
          data[index + 3] = 255; // A
        } else {
          // 改进的边缘抗锯齿处理
          const edgeDistance = distance - radius;
          if (edgeDistance < 2) {
            const alpha = Math.max(0, 1 - edgeDistance / 2);
            const index = (y * offscreenCanvas.width + x) * 4;

            // 计算边缘颜色（使用色轮边缘的颜色）
            const edgeAngle =
              ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
            const edgeColor = this.hslToRgb(edgeAngle, 1, lightness);

            data[index] = edgeColor[0]; // R
            data[index + 1] = edgeColor[1]; // G
            data[index + 2] = edgeColor[2]; // B
            data[index + 3] = Math.round(alpha * 255); // Alpha通道
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // 将高质量渲染结果绘制到实际canvas
    const mainCtx = canvas.getContext("2d");
    mainCtx.clearRect(0, 0, width, height);
    mainCtx.imageSmoothingEnabled = true;
    mainCtx.imageSmoothingQuality = "high";

    // 使用更平滑的缩放算法
    mainCtx.save();
    mainCtx.scale(1 / scale, 1 / scale);
    mainCtx.drawImage(offscreenCanvas, 0, 0);
    mainCtx.restore();
  }

  getColorFromWheel(x, y, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return null;

    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    const saturation = distance / radius;
    const lightness = (this.adjustments.wheelLightness || 50) / 100;

    return this.hslToRgb(angle, saturation, lightness);
  }

  selectColorFromWheel(rgb) {
    // Update adjustments based on selected color
    this.adjustments.temperature = (rgb[0] - 128) / 2;
    this.adjustments.tint = (rgb[1] - 128) / 2;

    // Update color preview
    this.updateColorPreview(rgb);

    this.queueRender();
    this.saveHistory("调整色轮");
  }

  updateColorPreview(rgb) {
    const [r, g, b] = rgb;
    const hex = this.rgbToHex(r, g, b);

    // Update selected color display
    const selectedColor = document.getElementById("selectedColor");
    const colorHex = document.getElementById("colorHex");
    const colorRGB = document.getElementById("colorRGB");

    if (selectedColor) selectedColor.style.background = `rgb(${r}, ${g}, ${b})`;
    if (colorHex) colorHex.textContent = hex;
    if (colorRGB) colorRGB.textContent = `RGB(${r}, ${g}, ${b})`;
  }

  updateColorPreviewFromWheel() {
    // 获取当前色轮指示器的位置
    const indicator = document.getElementById("colorIndicator");
    if (!indicator) return;

    // 获取色轮画布
    const canvas = document.getElementById("colorWheelCanvas");
    if (!canvas) return;

    // 计算指示器在画布上的实际位置
    const rect = canvas.getBoundingClientRect();
    const indicatorLeft = parseFloat(indicator.style.left) || 50; // 默认中心位置
    const indicatorTop = parseFloat(indicator.style.top) || 50; // 默认中心位置

    // 转换为画布坐标
    const x = (indicatorLeft / 100) * canvas.width;
    const y = (indicatorTop / 100) * canvas.height;

    // 从色轮获取颜色
    const color = this.getColorFromWheel(x, y, canvas.width, canvas.height);
    if (color) {
      this.updateColorPreview(color);
    }
  }

  rgbToHex(r, g, b) {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }

  // ==================== COLOR CONVERSION ====================
  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      // Convert hue from 0-360 to 0-1
      const hue = h / 360;
      r = hue2rgb(p, q, hue + 1 / 3);
      g = hue2rgb(p, q, hue);
      b = hue2rgb(p, q, hue - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // ==================== SLIDER UPDATES ====================
  updateAllSliders() {
    // Update all slider positions based on current adjustments
    const sliderIds = [
      "exposure",
      "contrast",
      "highlights",
      "shadows",
      "whites",
      "blacks",
      "temperature",
      "tint",
      "vibrance",
      "saturation",
      "clarity",
      "dehaze",
      "sharpen",
      "vignette",
      "grain",
      "highlightTone",
      "shadowTone",
      "toneBalance",
      "paletteHue",
      "paletteSat",
      "intensity",
      "wheelLightness",
    ];

    sliderIds.forEach((id) => {
      const value = this.adjustments[id] || 0;
      const track = document.querySelector(`[data-slider="${id}"]`);
      if (track) {
        const fill = track.querySelector(".slider-fill");
        const thumb = track.querySelector(".slider-thumb");
        const display = document.querySelector(`[data-value="${id}"]`);

        if (fill && thumb && display) {
          const min = -100;
          const max = 100;
          const range = max - min;
          const percent = (value - min) / range;
          const isCentered = min < 0;

          thumb.style.left = `${percent * 100}%`;

          if (isCentered) {
            const center = 50;
            if (value >= 0) {
              fill.style.left = "50%";
              fill.style.width = `${(value / max) * 50}%`;
            } else {
              fill.style.left = `${50 + (value / Math.abs(min)) * 50}%`;
              fill.style.width = `${Math.abs(value / min) * 50}%`;
            }
          } else {
            fill.style.left = "0";
            fill.style.width = `${percent * 100}%`;
          }

          display.textContent = Math.round(value);
        }
      }
    });
  }

  // ==================== ADJUSTMENT APPLICATIONS ====================
  applyAllAdjustments(imageData) {
    // Apply all adjustments to image data
    const data = imageData.data;

    // Basic adjustments
    this.applyExposure(data);
    this.applyContrast(data);
    this.applySaturation(data);
    this.applyTemperature(data);

    // Apply color card settings if selected
    this.applyColorCardSettings(data);

    // More adjustments can be added here
  }

  applyColorCardSettings(data) {
    if (!this.adjustments.selectedColorCard) return;

    const card = this.adjustments.selectedColorCard;
    const settings = card.settings;

    // Apply each setting from the color card
    if (settings.temperature !== undefined) {
      const temp = settings.temperature;
      for (let i = 0; i < data.length; i += 4) {
        if (temp > 0) {
          data[i] = Math.min(255, data[i] + temp); // R
          data[i + 2] = Math.max(0, data[i + 2] - temp); // B
        } else {
          data[i] = Math.max(0, data[i] + temp); // R
          data[i + 2] = Math.min(255, data[i + 2] - temp); // B
        }
      }
    }

    if (settings.saturation !== undefined) {
      const sat = settings.saturation / 100;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        data[i] = Math.min(255, Math.max(0, gray + sat * (r - gray)));
        data[i + 1] = Math.min(255, Math.max(0, gray + sat * (g - gray)));
        data[i + 2] = Math.min(255, Math.max(0, gray + sat * (b - gray)));
      }
    }

    if (settings.contrast !== undefined) {
      const contrast = settings.contrast / 100;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(
          255,
          Math.max(0, factor * (data[i + 1] - 128) + 128)
        );
        data[i + 2] = Math.min(
          255,
          Math.max(0, factor * (data[i + 2] - 128) + 128)
        );
      }
    }

    // Add more settings as needed
  }

  applyExposure(data) {
    const exposure = (this.adjustments.exposure / 100) * 2;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] * (1 + exposure))); // R
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * (1 + exposure))); // G
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * (1 + exposure))); // B
    }
  }

  applyContrast(data) {
    const contrast = this.adjustments.contrast / 100;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128)); // R
      data[i + 1] = Math.min(
        255,
        Math.max(0, factor * (data[i + 1] - 128) + 128)
      ); // G
      data[i + 2] = Math.min(
        255,
        Math.max(0, factor * (data[i + 2] - 128) + 128)
      ); // B
    }
  }

  applySaturation(data) {
    const saturation = this.adjustments.saturation / 100;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;

      data[i] = Math.min(255, Math.max(0, gray + saturation * (r - gray))); // R
      data[i + 1] = Math.min(255, Math.max(0, gray + saturation * (g - gray))); // G
      data[i + 2] = Math.min(255, Math.max(0, gray + saturation * (b - gray))); // B
    }
  }

  applyTemperature(data) {
    const temperature = (this.adjustments.temperature / 100) * 100;
    for (let i = 0; i < data.length; i += 4) {
      if (temperature > 0) {
        // Warm (increase red, decrease blue)
        data[i] = Math.min(255, data[i] + temperature); // R
        data[i + 2] = Math.max(0, data[i + 2] - temperature); // B
      } else {
        // Cool (decrease red, increase blue)
        data[i] = Math.max(0, data[i] + temperature); // R
        data[i + 2] = Math.min(255, data[i + 2] - temperature); // B
      }
    }
  }

  // ==================== HISTORY MANAGEMENT ====================
  saveHistory(description) {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push({
      adjustments: JSON.parse(JSON.stringify(this.adjustments)),
      description: description,
      timestamp: Date.now(),
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
    this.updateHistoryButtons();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.adjustments = JSON.parse(
        JSON.stringify(this.history[this.historyIndex].adjustments)
      );
      this.updateAllSliders();
      this.drawCurve();
      this.queueRender();
      this.updateHistoryButtons();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.adjustments = JSON.parse(
        JSON.stringify(this.history[this.historyIndex].adjustments)
      );
      this.updateAllSliders();
      this.drawCurve();
      this.queueRender();
      this.updateHistoryButtons();
    }
  }

  updateHistoryButtons() {
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");

    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn)
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  }

  // ==================== RESET METHODS ====================
  resetBasic() {
    const basicKeys = [
      "exposure",
      "contrast",
      "highlights",
      "shadows",
      "whites",
      "blacks",
      "temperature",
      "tint",
      "vibrance",
      "saturation",
      "clarity",
      "dehaze",
      "sharpen",
      "vignette",
      "grain",
    ];
    basicKeys.forEach((key) => {
      this.adjustments[key] = 0;
    });
    this.updateAllSliders();
    this.queueRender();
    this.saveHistory("重置基础调整");
  }

  resetCurve() {
    this.adjustments.curve = {
      rgb: [
        [0, 0],
        [255, 255],
      ],
      red: [
        [0, 0],
        [255, 255],
      ],
      green: [
        [0, 0],
        [255, 255],
      ],
      blue: [
        [0, 0],
        [255, 255],
      ],
    };
    this.drawCurve();
    this.queueRender();
    this.saveHistory("重置曲线");
  }

  resetHSL() {
    Object.keys(this.adjustments.hsl).forEach((color) => {
      this.adjustments.hsl[color] = { hue: 0, sat: 0, lum: 0 };
    });
    this.queueRender();
    this.saveHistory("重置HSL");
  }

  resetSplitToning() {
    this.adjustments.highlightColor = "#ffaa00";
    this.adjustments.highlightTone = 0;
    this.adjustments.shadowColor = "#0066ff";
    this.adjustments.shadowTone = 0;
    this.adjustments.toneBalance = 0;
    this.queueRender();
    this.saveHistory("重置分离色调");
  }

  resetPalette() {
    // Reset basic palette parameters
    this.adjustments.paletteHue = 0;
    this.adjustments.paletteSat = 0;
    this.adjustments.wheelLightness = 50;

    // Reset color indicator position
    const indicator = document.getElementById("colorIndicator");
    if (indicator) {
      indicator.style.top = "50%";
      indicator.style.left = "50%";
    }

    // Reset color preview to default
    this.updateColorPreview([255, 87, 51]); // Default color: #FF5733

    // Reset selected color card
    this.resetColorCards();

    // Update all sliders to reflect reset values
    this.updateAllSliders();

    this.queueRender();
    this.saveHistory("重置调色板");
  }

  resetColorCards() {
    this.adjustments.selectedColorCard = null;
    document
      .querySelectorAll(".color-card")
      .forEach((c) => c.classList.remove("active"));
    this.queueRender();
    this.saveHistory("重置个性色卡");
  }

  // ==================== EXPORT ====================
  exportImage() {
    if (!this.originalImage) {
      alert("请先加载图片");
      return;
    }

    const link = document.createElement("a");
    link.download = "edited-photo.png";
    link.href = this.canvas.toDataURL();
    link.click();
  }

  // ==================== PANEL MANAGEMENT ====================
  togglePanel(side) {
    const panel = document.getElementById(`${side}Panel`);
    const overlay = document.getElementById("panelOverlay");

    if (panel && overlay) {
      panel.classList.toggle("open");
      overlay.style.display = panel.classList.contains("open")
        ? "block"
        : "none";
    }
  }

  closeAllPanels() {
    document.querySelectorAll(".side-panel").forEach((panel) => {
      panel.classList.remove("open");
    });
    const overlay = document.getElementById("panelOverlay");
    if (overlay) overlay.style.display = "none";
  }

  // ==================== COMPARE MODE ====================
  toggleCompare() {
    this.isComparing = !this.isComparing;
    const compareToggle = document.getElementById("compareToggle");
    if (compareToggle) {
      compareToggle.classList.toggle("active", this.isComparing);
    }
    this.queueRender();
  }

  showComparison() {
    const canvas = document.getElementById("imageCanvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
    const ctx = canvas.getContext("2d");

    // Draw original image on left half
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw original image (left side)
    ctx.drawImage(this.originalImage, 0, 0, width / 2, height);

    // Draw processed image (right side)
    const processedCanvas = document.createElement("canvas");
    processedCanvas.width = this.originalImage.width;
    processedCanvas.height = this.originalImage.height;
    const processedCtx = processedCanvas.getContext("2d");

    // Apply current adjustments to create processed image
    processedCtx.drawImage(this.originalImage, 0, 0);
    const imageData = processedCtx.getImageData(
      0,
      0,
      processedCanvas.width,
      processedCanvas.height
    );
    this.processImageData(imageData.data);
    processedCtx.putImageData(imageData, 0, 0);

    // Draw processed image on right half
    ctx.drawImage(processedCanvas, width / 2, 0, width / 2, height);

    // Draw vertical divider line
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ==================== HSL TABS ====================
  switchHSLTab(target) {
    // Hide all HSL content
    document.querySelectorAll(".hsl-content").forEach((content) => {
      content.style.display = "none";
    });

    // Remove active class from all tabs
    document.querySelectorAll(".hsl-tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    // Show target content and activate tab
    const hslElement = document.getElementById(`${target}HSL`);
    if (hslElement) {
      hslElement.style.display = "block";
    }
    const targetElement = document.querySelector(`[data-target="${target}"]`);
    if (targetElement) {
      targetElement.classList.add("active");
    }
  }

  // ==================== PRESET FILTERING ====================
  filterPresets(category) {
    // Remove active class from all filters
    document.querySelectorAll(".category-btn").forEach((filter) => {
      filter.classList.remove("active");
    });

    // Add active class to selected filter
    const filterElement = document.querySelector(
      `[data-category="${category}"]`
    );
    if (filterElement) {
      filterElement.classList.add("active");
    }

    // Show/hide presets based on category
    const presetContainers = document.querySelectorAll(".preset-container");
    presetContainers.forEach((container) => {
      if (category === "全部" || container.dataset.category === category) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    });
  }

  // ==================== PRESET SEARCH ====================
  searchPresets(query) {
    const searchTerm = query.toLowerCase();
    const presetCards = document.querySelectorAll(".filter-card, .film-card");

    presetCards.forEach((card) => {
      const name =
        card.querySelector(".preset-name")?.textContent?.toLowerCase() || "";
      if (name.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // ==================== EVENT LISTENERS ====================
  initEventListeners() {
    // File input
    const fileInput = document.getElementById("fileInput");
    const overlay = document.getElementById("canvasOverlay");

    overlay?.addEventListener("click", () => fileInput?.click());
    fileInput?.addEventListener("change", (e) =>
      this.handleFile(e.target.files[0])
    );

    // Drag and drop
    const wrapper = document.getElementById("canvasWrapper");
    wrapper?.addEventListener("dragover", (e) => {
      e.preventDefault();
      overlay?.classList.add("dragover");
    });
    wrapper?.addEventListener("dragleave", () =>
      overlay?.classList.remove("dragover")
    );
    wrapper?.addEventListener("drop", (e) => {
      e.preventDefault();
      overlay?.classList.remove("dragover");
      if (e.dataTransfer.files[0]) this.handleFile(e.dataTransfer.files[0]);
    });

    // Zoom controls
    document
      .getElementById("zoomIn")
      ?.addEventListener("click", () => this.setZoom(this.zoom * 1.25));
    document
      .getElementById("zoomOut")
      ?.addEventListener("click", () => this.setZoom(this.zoom / 1.25));
    document
      .getElementById("zoomFit")
      ?.addEventListener("click", () => this.fitToView());

    // Compare toggle
    document.getElementById("compareToggle")?.addEventListener("click", () => {
      this.toggleCompare();
    });

    // Undo/Redo
    document
      .getElementById("undoBtn")
      ?.addEventListener("click", () => this.undo());
    document
      .getElementById("redoBtn")
      ?.addEventListener("click", () => this.redo());

    // Export
    document
      .getElementById("exportBtn")
      ?.addEventListener("click", () => this.exportImage());

    // Reset buttons
    document
      .getElementById("resetBasic")
      ?.addEventListener("click", () => this.resetBasic());
    document
      .getElementById("resetCurve")
      ?.addEventListener("click", () => this.resetCurve());
    document
      .getElementById("resetHSL")
      ?.addEventListener("click", () => this.resetHSL());
    document
      .getElementById("resetSplit")
      ?.addEventListener("click", () => this.resetSplitToning());
    document
      .getElementById("resetPalette")
      ?.addEventListener("click", () => this.resetPalette());

    // Category filter
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".category-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.filterPresets(e.target.dataset.category);
      });
    });

    // Search
    document.getElementById("presetSearch")?.addEventListener("input", (e) => {
      this.searchPresets(e.target.value);
    });

    // Split toning
    document
      .getElementById("highlightColor")
      ?.addEventListener("input", (e) => {
        this.adjustments.highlightColor = e.target.value;
        document.getElementById("highlightDisplay").style.background =
          e.target.value;
        this.queueRender();
      });

    document.getElementById("shadowColor")?.addEventListener("input", (e) => {
      this.adjustments.shadowColor = e.target.value;
      document.getElementById("shadowDisplay").style.background =
        e.target.value;
      this.queueRender();
    });

    // Collapsible sections
    document
      .querySelectorAll(".section-header[data-toggle]")
      .forEach((header) => {
        header.addEventListener("click", () => {
          header.closest(".collapsible")?.classList.toggle("collapsed");
        });
      });

    // Curve presets
    document.querySelectorAll(".curve-preset").forEach((preset) => {
      preset.addEventListener("click", () => {
        const presetName = preset.dataset.preset;
        this.applyCurvePreset(presetName);
      });
    });

    // HSL tabs
    document.querySelectorAll(".hsl-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".hsl-tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.showHSLType(tab.dataset.type);
      });
    });

    // Mobile panel toggles
    document
      .getElementById("mobileAdjustBtn")
      ?.addEventListener("click", () => this.togglePanel("left"));
    document
      .getElementById("mobilePresetBtn")
      ?.addEventListener("click", () => this.togglePanel("right"));
    document
      .getElementById("panelOverlay")
      ?.addEventListener("click", () => this.closeAllPanels());
    document.querySelectorAll(".panel-close").forEach((btn) => {
      btn.addEventListener("click", () => this.closeAllPanels());
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          this.undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          this.redo();
        } else if (e.key === "s") {
          e.preventDefault();
          this.exportImage();
        }
      }
      if (e.key === " " && this.originalImage) {
        e.preventDefault();
        this.toggleCompare();
      }
    });

    // Window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.initCurveEditor();
        this.initColorPalette();
      }, 200);
    });
  }

  // ==================== SLIDERS ====================
  initSliders() {
    const configs = [
      { id: "exposure", min: -100, max: 100 },
      { id: "contrast", min: -100, max: 100 },
      { id: "highlights", min: -100, max: 100 },
      { id: "shadows", min: -100, max: 100 },
      { id: "whites", min: -100, max: 100 },
      { id: "blacks", min: -100, max: 100 },
      { id: "temperature", min: -100, max: 100 },
      { id: "tint", min: -100, max: 100 },
      { id: "vibrance", min: -100, max: 100 },
      { id: "saturation", min: -100, max: 100 },
      { id: "clarity", min: -100, max: 100 },
      { id: "dehaze", min: -100, max: 100 },
      { id: "sharpen", min: 0, max: 100 },
      { id: "vignette", min: -100, max: 100 },
      { id: "grain", min: 0, max: 100 },
      { id: "highlightTone", min: 0, max: 100 },
      { id: "shadowTone", min: 0, max: 100 },
      { id: "toneBalance", min: -100, max: 100 },
      { id: "paletteHue", min: -100, max: 100 },
      { id: "paletteSat", min: -100, max: 100 },
      { id: "intensity", min: 0, max: 100, defaultValue: 100 },
      { id: "wheelLightness", min: 0, max: 100, defaultValue: 50 },
    ];

    configs.forEach((c) => this.initSlider(c));
  }

  initSlider(config) {
    const track = document.querySelector(`[data-slider="${config.id}"]`);
    if (!track) return;

    // 检查是否为垂直滑块
    const isVertical = track.classList.contains("vertical-slider-track");

    const fill = track.querySelector(
      isVertical ? ".vertical-slider-fill" : ".slider-fill"
    );
    const thumb = track.querySelector(
      isVertical ? ".vertical-slider-thumb" : ".slider-thumb"
    );
    const display = document.querySelector(`[data-value="${config.id}"]`);

    let isDragging = false;
    let animationFrameId = null;

    // 直接设置样式，避免使用过渡动画
    const update = (value) => {
      const { min, max } = config;
      const range = max - min;
      const percent = (value - min) / range;
      const isCentered = min < 0;

      if (isVertical) {
        // 垂直滑块逻辑 - 直接设置样式，不依赖CSS过渡
        thumb.style.bottom = `${percent * 100}%`;

        if (isCentered) {
          const center = 50;
          if (value >= 0) {
            fill.style.bottom = "50%";
            fill.style.height = `${(value / max) * 50}%`;
          } else {
            fill.style.bottom = `${50 + (value / Math.abs(min)) * 50}%`;
            fill.style.height = `${Math.abs(value / min) * 50}%`;
          }
        } else {
          fill.style.bottom = "0";
          fill.style.height = `${percent * 100}%`;
        }
      } else {
        // 水平滑块逻辑
        thumb.style.left = `${percent * 100}%`;

        if (isCentered) {
          const center = 50;
          if (value >= 0) {
            fill.style.left = "50%";
            fill.style.width = `${(value / max) * 50}%`;
          } else {
            fill.style.left = `${50 + (value / Math.abs(min)) * 50}%`;
            fill.style.width = `${Math.abs(value / min) * 50}%`;
          }
        } else {
          fill.style.left = "0";
          fill.style.width = `${percent * 100}%`;
        }
      }

      if (display) display.textContent = Math.round(value);
    };

    const getValue = (e) => {
      const rect = track.getBoundingClientRect();

      if (isVertical) {
        // 垂直滑块：基于Y坐标计算值
        const y =
          rect.height -
          ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top);
        const percent = Math.max(0, Math.min(1, y / rect.height));
        return config.min + percent * (config.max - config.min);
      } else {
        // 水平滑块：基于X坐标计算值
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        return config.min + percent * (config.max - config.min);
      }
    };

    const start = (e) => {
      e.preventDefault();
      isDragging = true;
      const value = getValue(e);
      this.setSliderValue(config.id, value);
      update(value);
    };

    const move = (e) => {
      if (!isDragging) return;

      // 直接计算并更新，确保滑块和填充同步
      const value = getValue(e);
      this.setSliderValue(config.id, value);
      update(value);
    };

    const end = () => {
      if (isDragging) {
        isDragging = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        this.saveHistory(`调整 ${config.id}`);
      }
    };

    track.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    track.addEventListener("touchstart", start, { passive: false });
    document.addEventListener("touchmove", move, { passive: true });
    document.addEventListener("touchend", end);

    // Initialize display
    const initValue =
      config.defaultValue !== undefined
        ? config.defaultValue
        : config.id === "intensity"
        ? 100
        : 0;
    update(initValue);
  }

  setSliderValue(id, value) {
    if (id === "intensity") {
      this.adjustments.intensity = Math.round(value);
    } else if (id === "paletteHue") {
      this.adjustments.paletteHue = Math.round(value);
    } else if (id === "paletteSat") {
      this.adjustments.paletteSat = Math.round(value);
    } else if (id === "wheelLightness") {
      this.adjustments.wheelLightness = Math.round(value);
      // 亮度滑块需要重新绘制色轮
      this.drawColorWheel();
      // 实时更新颜色预览
      this.updateColorPreviewFromWheel();
    } else if (id.includes("Hue") || id.includes("Sat") || id.includes("Lum")) {
      // HSL slider
      const color = id.replace(/Hue|Sat|Lum/, "").toLowerCase();
      const type = id.includes("Hue")
        ? "hue"
        : id.includes("Sat")
        ? "sat"
        : "lum";
      if (this.adjustments.hsl[color]) {
        this.adjustments.hsl[color][type] = Math.round(value);
      }
    } else if (this.adjustments.hasOwnProperty(id)) {
      this.adjustments[id] = Math.round(value);
    }
    this.queueRender();
  }

  // ==================== HSL SLIDERS ====================
  initHSLSliders() {
    const container = document.getElementById("hslSliders");
    if (!container) return;

    const colors = [
      { id: "red", name: "红", color: "#ef4444" },
      { id: "orange", name: "橙", color: "#f97316" },
      { id: "yellow", name: "黄", color: "#eab308" },
      { id: "green", name: "绿", color: "#22c55e" },
      { id: "cyan", name: "青", color: "#06b6d4" },
      { id: "blue", name: "蓝", color: "#3b82f6" },
      { id: "purple", name: "紫", color: "#a855f7" },
      { id: "magenta", name: "品红", color: "#ec4899" },
    ];

    container.innerHTML = "";

    colors.forEach((c) => {
      const item = document.createElement("div");
      item.className = "hsl-slider-item";
      item.dataset.hslColor = c.id;
      item.dataset.hslType = "hue";
      item.innerHTML = `
                <span class="hsl-color-dot" style="background: ${c.color}"></span>
                <div class="slider-track" data-slider="${c.id}Hue">
                    <div class="slider-fill"></div>
                    <div class="slider-thumb"></div>
                </div>
                <span class="slider-value" data-value="${c.id}Hue">0</span>
            `;
      container.appendChild(item);

      this.initSlider({ id: `${c.id}Hue`, min: -180, max: 180 });
    });

    this.showHSLType("hue");
  }

  showHSLType(type) {
    const container = document.getElementById("hslSliders");
    if (!container) return;

    const colorDots = [
      { id: "red", color: "#ef4444" },
      { id: "orange", color: "#f97316" },
      { id: "yellow", color: "#eab308" },
      { id: "green", color: "#22c55e" },
      { id: "cyan", color: "#06b6d4" },
      { id: "blue", color: "#3b82f6" },
      { id: "purple", color: "#a855f7" },
      { id: "magenta", color: "#ec4899" },
    ];

    const typeMap = { hue: "Hue", sat: "Sat", lum: "Lum" };
    const suffix = typeMap[type];
    const min = type === "hue" ? -180 : -100;
    const max = type === "hue" ? 180 : 100;

    container.innerHTML = "";

    colorDots.forEach((c) => {
      const value = this.adjustments.hsl[c.id]?.[type] || 0;
      const item = document.createElement("div");
      item.className = "hsl-slider-item";
      item.innerHTML = `
                <span class="hsl-color-dot" style="background: ${c.color}"></span>
                <div class="slider-track" data-slider="${c.id}${suffix}">
                    <div class="slider-fill"></div>
                    <div class="slider-thumb"></div>
                </div>
                <span class="slider-value" data-value="${c.id}${suffix}">${value}</span>
            `;
      container.appendChild(item);

      this.initSlider({ id: `${c.id}${suffix}`, min, max });
    });
  }

  // ==================== CURVE PRESETS ====================
  applyCurvePreset(presetName) {
    const preset = this.getCurvePreset(presetName);
    if (!preset) return;

    // Apply the preset curve to current channel
    this.adjustments.curve[this.currentCurveChannel] = JSON.parse(
      JSON.stringify(preset[this.currentCurveChannel])
    );

    // Force curve update for next render
    this.curveNeedsUpdate = true;
    this.curveLUT = null;

    // Update UI
    this.drawCurve();
    this.queueRender();
    this.saveHistory(`应用曲线预设: ${presetName}`);
  }

  getCurvePreset(presetName) {
    const presets = {
      linear: {
        rgb: [
          [0, 0],
          [255, 255],
        ],
        red: [
          [0, 0],
          [255, 255],
        ],
        green: [
          [0, 0],
          [255, 255],
        ],
        blue: [
          [0, 0],
          [255, 255],
        ],
      },
      contrast: {
        rgb: [
          [0, 0],
          [128, 80],
          [255, 255],
        ],
        red: [
          [0, 0],
          [255, 255],
        ],
        green: [
          [0, 0],
          [255, 255],
        ],
        blue: [
          [0, 0],
          [255, 255],
        ],
      },
      fade: {
        rgb: [
          [0, 40],
          [128, 200],
          [255, 220],
        ],
        red: [
          [0, 30],
          [128, 180],
          [255, 240],
        ],
        green: [
          [0, 50],
          [128, 190],
          [255, 230],
        ],
        blue: [
          [0, 60],
          [128, 210],
          [255, 250],
        ],
      },
      film: {
        rgb: [
          [0, 0],
          [64, 30],
          [128, 140],
          [192, 220],
          [255, 255],
        ],
        red: [
          [0, 0],
          [128, 160],
          [255, 255],
        ],
        green: [
          [0, 0],
          [128, 120],
          [255, 240],
        ],
        blue: [
          [0, 0],
          [128, 100],
          [255, 220],
        ],
      },
      punch: {
        rgb: [
          [0, 0],
          [64, 30],
          [128, 128],
          [192, 220],
          [255, 255],
        ],
        red: [
          [0, 0],
          [255, 255],
        ],
        green: [
          [0, 0],
          [255, 255],
        ],
        blue: [
          [0, 0],
          [255, 255],
        ],
      },
      cross: {
        rgb: [
          [0, 0],
          [64, 96],
          [192, 160],
          [255, 255],
        ],
        red: [
          [0, 0],
          [128, 140],
          [255, 255],
        ],
        green: [
          [0, 0],
          [128, 120],
          [255, 240],
        ],
        blue: [
          [0, 0],
          [128, 100],
          [255, 220],
        ],
      },
      vintage: {
        rgb: [
          [0, 0],
          [128, 150],
          [255, 240],
        ],
        red: [
          [0, 0],
          [128, 140],
          [255, 255],
        ],
        green: [
          [0, 0],
          [128, 120],
          [255, 240],
        ],
        blue: [
          [0, 0],
          [128, 100],
          [255, 220],
        ],
      },
    };

    return presets[presetName];
  }

  // ==================== RESET FUNCTIONS ====================
  resetBasic() {
    const basicParams = [
      "exposure",
      "contrast",
      "highlights",
      "shadows",
      "whites",
      "blacks",
      "temperature",
      "tint",
      "vibrance",
      "saturation",
      "clarity",
      "dehaze",
      "sharpen",
      "vignette",
      "grain",
    ];
    basicParams.forEach((p) => {
      this.adjustments[p] = 0;
      const valueEl = document.querySelector(`[data-value="${p}"]`);
      if (valueEl) valueEl.textContent = "0";
      this.updateSliderUI(p, 0);
    });
    this.saveHistory("重置基础调整");
    this.queueRender();
  }

  resetCurve() {
    this.adjustments.curve = {
      rgb: [
        [0, 0],
        [255, 255],
      ],
      red: [
        [0, 0],
        [255, 255],
      ],
      green: [
        [0, 0],
        [255, 255],
      ],
      blue: [
        [0, 0],
        [255, 255],
      ],
    };
    this.curveLUT = null;
    this.saveHistory("重置曲线");
    this.drawCurve();
    this.queueRender();
  }

  resetHSL() {
    const colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "cyan",
      "blue",
      "purple",
      "magenta",
    ];
    colors.forEach((c) => {
      this.adjustments.hsl[c] = { hue: 0, sat: 0, lum: 0 };
    });
    this.initHSLSliders();
    this.saveHistory("重置HSL");
    this.queueRender();
  }

  resetSplitToning() {
    this.adjustments.highlightColor = "#ffaa00";
    this.adjustments.highlightTone = 0;
    this.adjustments.shadowColor = "#0066ff";
    this.adjustments.shadowTone = 0;
    this.adjustments.toneBalance = 0;

    const hc = document.getElementById("highlightColor");
    const sc = document.getElementById("shadowColor");
    if (hc) hc.value = "#ffaa00";
    if (sc) sc.value = "#0066ff";
    document
      .getElementById("highlightDisplay")
      ?.style.setProperty("background", "#ffaa00");
    document
      .getElementById("shadowDisplay")
      ?.style.setProperty("background", "#0066ff");

    ["highlightTone", "shadowTone", "toneBalance"].forEach((id) => {
      this.updateSliderUI(id, 0);
      const valueEl = document.querySelector(`[data-value="${id}"]`);
      if (valueEl) valueEl.textContent = "0";
    });

    this.saveHistory("重置分离色调");
    this.queueRender();
  }

  resetPalette() {
    this.adjustments.paletteHue = 0;
    this.adjustments.paletteSat = 0;
    const indicator = document.querySelector(".palette-indicator");
    if (indicator) indicator.remove();
    this.saveHistory("重置调色板");
    this.queueRender();
  }

  updateSliderUI(id, value) {
    const track = document.querySelector(`[data-slider="${id}"]`);
    if (!track) return;

    const fill = track.querySelector(".slider-fill");
    const thumb = track.querySelector(".slider-thumb");

    // Get min/max from slider config
    let min = -100,
      max = 100;
    if (id === "intensity") {
      min = 0;
      max = 100;
    } else if (id.includes("Hue")) {
      min = -180;
      max = 180;
    }

    const percent = ((value - min) / (max - min)) * 100;
    const center = ((0 - min) / (max - min)) * 100;

    if (fill) {
      if (min < 0) {
        const left = Math.min(center, percent);
        const width = Math.abs(percent - center);
        fill.style.left = `${left}%`;
        fill.style.width = `${width}%`;
      } else {
        fill.style.left = "0%";
        fill.style.width = `${percent}%`;
      }
    }
    if (thumb) thumb.style.left = `${percent}%`;
  }

  // ==================== MOBILE PANEL ====================
  togglePanel(side) {
    const leftPanel = document.querySelector(".left-panel");
    const rightPanel = document.querySelector(".right-panel");
    const overlay = document.getElementById("panelOverlay");

    if (side === "left") {
      leftPanel?.classList.toggle("open");
      rightPanel?.classList.remove("open");
    } else {
      rightPanel?.classList.toggle("open");
      leftPanel?.classList.remove("open");
    }

    const isOpen =
      leftPanel?.classList.contains("open") ||
      rightPanel?.classList.contains("open");
    overlay?.classList.toggle("active", isOpen);
  }

  closeAllPanels() {
    document.querySelector(".left-panel")?.classList.remove("open");
    document.querySelector(".right-panel")?.classList.remove("open");
    document.getElementById("panelOverlay")?.classList.remove("active");
  }

  // ==================== HISTORY ====================
  saveHistory(action = "调整") {
    if (!this.originalImage) return;

    // Remove any redo states
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Save current state
    this.history.push({
      action,
      adjustments: JSON.parse(JSON.stringify(this.adjustments)),
      timestamp: Date.now(),
    });

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.historyIndex = this.history.length - 1;
    this.updateHistoryUI();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.adjustments = JSON.parse(
        JSON.stringify(this.history[this.historyIndex].adjustments)
      );
      this.curveLUT = null;
      this.updateAllSliders();
      this.drawCurve();
      this.queueRender();
      this.updateHistoryUI();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.adjustments = JSON.parse(
        JSON.stringify(this.history[this.historyIndex].adjustments)
      );
      this.curveLUT = null;
      this.updateAllSliders();
      this.drawCurve();
      this.queueRender();
      this.updateHistoryUI();
    }
  }

  updateHistoryUI() {
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
    if (redoBtn)
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
  }

  updateAllSliders() {
    const params = [
      "exposure",
      "contrast",
      "highlights",
      "shadows",
      "whites",
      "blacks",
      "temperature",
      "tint",
      "vibrance",
      "saturation",
      "clarity",
      "dehaze",
      "sharpen",
      "vignette",
      "grain",
      "highlightTone",
      "shadowTone",
      "toneBalance",
      "intensity",
    ];

    params.forEach((p) => {
      const value = this.adjustments[p] || 0;
      this.updateSliderUI(p, value);
      const valueEl = document.querySelector(`[data-value="${p}"]`);
      if (valueEl) valueEl.textContent = value;
    });

    // Update intensity
    this.updateSliderUI("intensity", this.adjustments.intensity || 100);
    const intensityVal = document.querySelector('[data-value="intensity"]');
    if (intensityVal)
      intensityVal.textContent = this.adjustments.intensity || 100;

    // Update split toning colors
    const hc = document.getElementById("highlightColor");
    const sc = document.getElementById("shadowColor");
    if (hc) hc.value = this.adjustments.highlightColor;
    if (sc) sc.value = this.adjustments.shadowColor;
    document
      .getElementById("highlightDisplay")
      ?.style.setProperty("background", this.adjustments.highlightColor);
    document
      .getElementById("shadowDisplay")
      ?.style.setProperty("background", this.adjustments.shadowColor);

    // Update HSL
    this.initHSLSliders();
  }

  // ==================== EXPORT ====================
  exportImage() {
    if (!this.originalImage) {
      alert("请先加载图片");
      return;
    }

    // Create full resolution canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = this.originalImage.width;
    exportCanvas.height = this.originalImage.height;
    const exportCtx = exportCanvas.getContext("2d");

    // Draw and process at full resolution
    exportCtx.drawImage(this.originalImage, 0, 0);
    const imageData = exportCtx.getImageData(
      0,
      0,
      exportCanvas.width,
      exportCanvas.height
    );
    this.applyAllAdjustments(imageData);
    exportCtx.putImageData(imageData, 0, 0);

    // Download
    const link = document.createElement("a");
    link.download = `photostudio_${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  }

  // ==================== IMAGE PROCESSING ====================
  applyAllAdjustments(imageData) {
    const data = imageData.data;
    const len = data.length;

    // Build curve LUT if needed
    if (!this.curveLUT || this.curveNeedsUpdate) {
      this.curveLUT = this.buildCurveLUT();
      this.curveNeedsUpdate = false;
    }

    // Get preset influence
    const intensity = (this.adjustments.intensity || 100) / 100;
    const preset = this.adjustments.currentPreset;

    for (let i = 0; i < len; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply curves - FIXED: Correct curve application order
      // First apply individual channel curves
      r = this.curveLUT.red[r];
      g = this.curveLUT.green[g];
      b = this.curveLUT.blue[b];

      // Then apply RGB master curve
      r = this.curveLUT.rgb[r];
      g = this.curveLUT.rgb[g];
      b = this.curveLUT.rgb[b];

      // Exposure
      if (this.adjustments.exposure !== 0) {
        const exp = Math.pow(2, this.adjustments.exposure / 100);
        r *= exp;
        g *= exp;
        b *= exp;
      }

      // Contrast
      if (this.adjustments.contrast !== 0) {
        const factor =
          (259 * (this.adjustments.contrast + 255)) /
          (255 * (259 - this.adjustments.contrast));
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
      }

      // Temperature & Tint
      if (this.adjustments.temperature !== 0) {
        r += this.adjustments.temperature * 0.5;
        b -= this.adjustments.temperature * 0.5;
      }
      if (this.adjustments.tint !== 0) {
        g += this.adjustments.tint * 0.3;
      }

      // Highlights & Shadows
      const lum = (r + g + b) / 3;
      if (this.adjustments.highlights !== 0 && lum > 128) {
        const factor =
          ((lum - 128) / 127) * (this.adjustments.highlights / 100);
        r += factor * 30;
        g += factor * 30;
        b += factor * 30;
      }
      if (this.adjustments.shadows !== 0 && lum < 128) {
        const factor = ((128 - lum) / 128) * (this.adjustments.shadows / 100);
        r += factor * 30;
        g += factor * 30;
        b += factor * 30;
      }

      // Whites & Blacks
      if (this.adjustments.whites !== 0 && lum > 200) {
        const factor = ((lum - 200) / 55) * (this.adjustments.whites / 100);
        r += factor * 20;
        g += factor * 20;
        b += factor * 20;
      }
      if (this.adjustments.blacks !== 0 && lum < 50) {
        const factor = ((50 - lum) / 50) * (this.adjustments.blacks / 100);
        r += factor * 20;
        g += factor * 20;
        b += factor * 20;
      }

      // HSL adjustments
      let [h, s, l] = this.rgbToHsl(r, g, b);
      const hslColor = this.getHSLColorName(h);
      const hslAdj = this.adjustments.hsl[hslColor];
      if (hslAdj) {
        h += hslAdj.hue;
        s = Math.max(0, Math.min(1, s + hslAdj.sat / 100));
        l = Math.max(0, Math.min(1, l + hslAdj.lum / 200));
      }
      [r, g, b] = this.hslToRgb(h, s, l);

      // Vibrance
      if (this.adjustments.vibrance !== 0) {
        const avg = (r + g + b) / 3;
        const maxC = Math.max(r, g, b);
        const factor = (1 - Math.pow(s, 2)) * (this.adjustments.vibrance / 100);
        r += (r - avg) * factor;
        g += (g - avg) * factor;
        b += (b - avg) * factor;
      }

      // Saturation
      if (this.adjustments.saturation !== 0) {
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        const sat = 1 + this.adjustments.saturation / 100;
        r = gray + sat * (r - gray);
        g = gray + sat * (g - gray);
        b = gray + sat * (b - gray);
      }

      // Split toning
      if (
        this.adjustments.highlightTone !== 0 ||
        this.adjustments.shadowTone !== 0
      ) {
        const lumNorm = lum / 255;
        const balance = (this.adjustments.toneBalance + 100) / 200;

        if (lumNorm > balance && this.adjustments.highlightTone !== 0) {
          const hColor = this.hexToRgb(this.adjustments.highlightColor);
          const blend =
            ((lumNorm - balance) / (1 - balance)) *
            (this.adjustments.highlightTone / 100);
          r = r * (1 - blend * 0.3) + hColor.r * blend * 0.3;
          g = g * (1 - blend * 0.3) + hColor.g * blend * 0.3;
          b = b * (1 - blend * 0.3) + hColor.b * blend * 0.3;
        }
        if (lumNorm < balance && this.adjustments.shadowTone !== 0) {
          const sColor = this.hexToRgb(this.adjustments.shadowColor);
          const blend =
            ((balance - lumNorm) / balance) *
            (this.adjustments.shadowTone / 100);
          r = r * (1 - blend * 0.3) + sColor.r * blend * 0.3;
          g = g * (1 - blend * 0.3) + sColor.g * blend * 0.3;
          b = b * (1 - blend * 0.3) + sColor.b * blend * 0.3;
        }
      }

      // Color palette influence
      if (this.adjustments.paletteSat > 0) {
        const paletteColor = this.hslToRgb(
          this.adjustments.paletteHue,
          0.7,
          0.5
        );
        const blend = this.adjustments.paletteSat / 500;
        r = r * (1 - blend) + paletteColor[0] * blend;
        g = g * (1 - blend) + paletteColor[1] * blend;
        b = b * (1 - blend) + paletteColor[2] * blend;
      }

      // Apply preset with intensity
      if (preset && intensity > 0) {
        const presetColor = this.applyPresetToPixel(r, g, b, preset);
        r = r * (1 - intensity) + presetColor[0] * intensity;
        g = g * (1 - intensity) + presetColor[1] * intensity;
        b = b * (1 - intensity) + presetColor[2] * intensity;
      }

      // Dehaze
      if (this.adjustments.dehaze !== 0) {
        const dehazeFactor = this.adjustments.dehaze / 100;
        r = r + (r - 128) * dehazeFactor * 0.5;
        g = g + (g - 128) * dehazeFactor * 0.5;
        b = b + (b - 128) * dehazeFactor * 0.5;
      }

      // Clarity (local contrast)
      if (this.adjustments.clarity !== 0) {
        const clarityFactor = this.adjustments.clarity / 200;
        const mid = 128;
        r = r + (r - mid) * clarityFactor;
        g = g + (g - mid) * clarityFactor;
        b = b + (b - mid) * clarityFactor;
      }

      // Grain
      if (this.adjustments.grain > 0) {
        const noise = (Math.random() - 0.5) * this.adjustments.grain * 2;
        r += noise;
        g += noise;
        b += noise;
      }

      // Clamp
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    // Vignette (applied after)
    if (this.adjustments.vignette !== 0) {
      this.applyVignette(imageData);
    }
  }

  applyPresetToPixel(r, g, b, preset) {
    // Simple preset color grading
    if (preset.tint) {
      const tint = this.hexToRgb(preset.tint);
      r = r * 0.9 + tint.r * 0.1;
      g = g * 0.9 + tint.g * 0.1;
      b = b * 0.9 + tint.b * 0.1;
    }
    if (preset.contrast) {
      const factor = 1 + preset.contrast / 100;
      r = (r - 128) * factor + 128;
      g = (g - 128) * factor + 128;
      b = (b - 128) * factor + 128;
    }
    if (preset.saturation) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const sat = 1 + preset.saturation / 100;
      r = gray + sat * (r - gray);
      g = gray + sat * (g - gray);
      b = gray + sat * (b - gray);
    }
    return [r, g, b];
  }

  applyVignette(imageData) {
    const { width, height, data } = imageData;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
    const strength = this.adjustments.vignette / 100;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        const vignette = 1 - dist * dist * strength;

        const i = (y * width + x) * 4;
        data[i] *= vignette;
        data[i + 1] *= vignette;
        data[i + 2] *= vignette;
      }
    }
  }

  buildCurveLUT() {
    const lut = {
      rgb: new Uint8Array(256),
      red: new Uint8Array(256),
      green: new Uint8Array(256),
      blue: new Uint8Array(256),
    };

    ["rgb", "red", "green", "blue"].forEach((channel) => {
      const points = this.adjustments.curve[channel];
      for (let i = 0; i < 256; i++) {
        lut[channel][i] = this.interpolateCurve(points, i);
      }
    });

    return lut;
  }

  interpolateCurve(points, x) {
    if (points.length < 2) return x;
    if (points.length === 2) {
      // For 2 points, use linear interpolation
      const t = (x - points[0][0]) / (points[1][0] - points[0][0]);
      return Math.round(points[0][1] + t * (points[1][1] - points[0][1]));
    }

    // For 3+ points, use Catmull-Rom spline interpolation for smooth curves
    // Find the segment containing x
    let segmentIndex = 0;
    for (let i = 0; i < points.length - 1; i++) {
      if (x >= points[i][0] && x <= points[i + 1][0]) {
        segmentIndex = i;
        break;
      }
    }

    // Handle edge cases
    if (x <= points[0][0]) return points[0][1];
    if (x >= points[points.length - 1][0]) return points[points.length - 1][1];

    // Get control points for Catmull-Rom spline
    const p0 =
      segmentIndex > 0 ? points[segmentIndex - 1] : points[segmentIndex];
    const p1 = points[segmentIndex];
    const p2 = points[segmentIndex + 1];
    const p3 =
      segmentIndex < points.length - 2
        ? points[segmentIndex + 2]
        : points[segmentIndex + 1];

    // Normalize x to t in [0,1] for the segment
    const t = (x - p1[0]) / (p2[0] - p1[0]);

    // Catmull-Rom spline formula
    const t2 = t * t;
    const t3 = t2 * t;

    const a = 2 * t3 - 3 * t2 + 1;
    const b = t3 - 2 * t2 + t;
    const c = -2 * t3 + 3 * t2;
    const d = t3 - t2;

    // Calculate the interpolated y value
    const y =
      a * p1[1] +
      b * (p2[0] - p0[0]) * 0.5 +
      c * p2[1] +
      d * (p3[0] - p1[0]) * 0.5;

    return Math.max(0, Math.min(255, Math.round(y)));
  }

  // Color conversion utilities
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return [h * 360, s, l];
  }

  hslToRgb(h, s, l) {
    h = (((h % 360) + 360) % 360) / 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
  }

  getHSLColorName(h) {
    h = ((h % 360) + 360) % 360;
    if (h < 15 || h >= 345) return "red";
    if (h < 45) return "orange";
    if (h < 75) return "yellow";
    if (h < 165) return "green";
    if (h < 195) return "cyan";
    if (h < 255) return "blue";
    if (h < 285) return "purple";
    return "magenta";
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  window.photoStudio = new PhotoStudio();
});
