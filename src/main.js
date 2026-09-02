import './styles.css';

const initialHash = location.hash;
if (initialHash) history.replaceState(null, '', `${location.pathname}${location.search}`);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo({ top: 0, left: 0, behavior: 'auto' });

const A = '/assets/';

const action = (label, href, tone = 'light') => `
  <a class="action action--${tone}" href="${href}">
    <span class="action__label">
      <span class="action__label-copy action__label-copy--leave">${label}</span>
      <span class="action__label-copy action__label-copy--enter" aria-hidden="true">${label}</span>
    </span>
    <span class="action__badge action__badge--leave" aria-hidden="true">
      <img class="action__mask" src="${A}button-diffuse.png" alt="">
      <img class="action__arrow action__arrow--leave" src="${A}imgFrame1.svg" alt="">
      <img class="action__arrow action__arrow--enter" src="${A}imgFrame1.svg" alt="">
    </span>
    <span class="action__badge action__badge--enter" aria-hidden="true">
      <img class="action__mask" src="${A}button-diffuse.png" alt="">
      <img class="action__arrow action__arrow--leave" src="${A}imgFrame1.svg" alt="">
      <img class="action__arrow action__arrow--enter" src="${A}imgFrame1.svg" alt="">
    </span>
  </a>`;

const titleGradientColor = progress => {
  const stops = [
    { at: 0, color: [255, 135, 0] },
    { at: .56, color: [141, 129, 255] },
    { at: 1, color: [63, 61, 221] },
  ];
  const right = stops.find(stop => progress <= stop.at) ?? stops[stops.length - 1];
  const rightIndex = stops.indexOf(right);
  const left = stops[Math.max(0, rightIndex - 1)];
  const range = Math.max(.0001, right.at - left.at);
  const mix = Math.min(1, Math.max(0, (progress - left.at) / range));
  const color = left.color.map((channel, index) => Math.round(
    channel + (right.color[index] - channel) * mix,
  ));
  return `rgb(${color.join(',')})`;
};

const backOut = progress => {
  const overshoot = 1.45;
  const shifted = progress - 1;
  return 1 + (overshoot + 1) * shifted ** 3 + overshoot * shifted ** 2;
};

const typewriterMarkup = (text, startIndex = 0, totalLength = text.length) => [...text].map((character, index) => {
  const progress = totalLength > 1 ? (startIndex + index) / (totalLength - 1) : 0;
  return `
  <span class="solutions__type-char${character === ' ' ? ' solutions__type-char--space' : ''}" style="--char-index:${startIndex + index};--char-color:${titleGradientColor(progress)}" aria-hidden="true">${character === ' ' ? '&nbsp;' : character}</span>`;
}).join('');

const sectionTitle = (eyebrow, title, inverted = false) => `
  <div class="section-title${inverted ? ' section-title--inverted' : ''}">
    <p>${eyebrow}</p><h2>${title}</h2>
  </div>`;

const partnerLogos = [
  { src: 'imgImage6.png', name: 'HMM', filter: 'invert(17%) sepia(41%) saturate(1812%) hue-rotate(185deg) brightness(72%) contrast(105%)' },
  { src: 'imgAirIndia1.png', name: 'Air India', filter: 'none' },
  { src: 'imgImage7.png', name: 'United Airlines', filter: 'invert(28%) sepia(98%) saturate(1474%) hue-rotate(187deg) brightness(81%) contrast(103%)' },
  { src: 'imgImage8.png', name: 'Hamburg Süd', filter: 'invert(17%) sepia(93%) saturate(5920%) hue-rotate(350deg) brightness(89%) contrast(102%)' },
  { src: 'imgImage9.png', name: 'CMA CGM', filter: 'invert(28%) sepia(98%) saturate(1474%) hue-rotate(187deg) brightness(81%) contrast(103%)' },
  { src: 'imgImage10.png', name: 'K Line', filter: 'invert(17%) sepia(93%) saturate(5920%) hue-rotate(350deg) brightness(89%) contrast(102%)' },
  { src: 'imgImage11.png', name: 'COSCO Shipping', filter: 'invert(28%) sepia(98%) saturate(1474%) hue-rotate(187deg) brightness(81%) contrast(103%)' },
  { src: 'imgImage12.png', name: 'Evergreen Line', filter: 'invert(32%) sepia(46%) saturate(1124%) hue-rotate(111deg) brightness(91%) contrast(98%)' },
  { src: 'imgImage13.png', name: 'Yang Ming', filter: 'invert(17%) sepia(93%) saturate(5920%) hue-rotate(350deg) brightness(89%) contrast(102%)' },
  { src: 'imgImage14.png', name: 'PIL', filter: 'invert(28%) sepia(98%) saturate(1474%) hue-rotate(187deg) brightness(81%) contrast(103%)' },
  { src: 'imgImage15.png', name: 'Malaysia Airlines', filter: 'invert(17%) sepia(93%) saturate(5920%) hue-rotate(350deg) brightness(89%) contrast(102%)' },
  { src: 'imgImage16.png', name: 'Fiji Airways', filter: 'invert(70%) sepia(66%) saturate(687%) hue-rotate(358deg) brightness(93%) contrast(93%)' },
  { src: 'imgImage17.png', name: 'British Airways', filter: 'invert(17%) sepia(41%) saturate(1812%) hue-rotate(185deg) brightness(72%) contrast(105%)' },
  { src: 'imgImage18.png', name: 'Vietnam Airlines', filter: 'invert(70%) sepia(66%) saturate(687%) hue-rotate(358deg) brightness(93%) contrast(93%)' },
  { src: 'imgImage19.png', name: 'Air China', filter: 'invert(17%) sepia(93%) saturate(5920%) hue-rotate(350deg) brightness(89%) contrast(102%)' },
];

const partnerCells = partnerLogos.map((logo, index) => {
  const col = index % 5;
  const row = Math.floor(index / 5);
  return `<div class="partner-cell" style="left:${80 + col * 352}px;top:${244 + row * 209}px;--partner-delay:${.14 + index * .035}s;--partner-logo-filter:${logo.filter};--partner-hover-bg:#f7f5f5">
    <span class="corner corner--tl"></span><span class="corner corner--tr"></span><span class="corner corner--bl"></span><span class="corner corner--br"></span>
    <img class="partner-cell__logo partner-cell__logo--mono" src="${A}${logo.src}" alt="${logo.name} 标志">
    <img class="partner-cell__logo partner-cell__logo--color" src="${A}${logo.src}" alt="" aria-hidden="true">
  </div>`;
}).join('');

const news = [
  { x: 80, title: '再下一城，晨昏线获得中国机器人行业年会“灵巧手最佳适配奖”', image: 'img3DRenderingIndustry40Concept1.png', imageClass: 'news-image--one' },
  { x: 526, title: '晨昏线斩获深圳智能机器人灵巧手大赛人气团队奖', image: 'img4435169A1.png', imageClass: 'news-image--two' },
  { x: 972, title: '说啥弹啥，晨昏线钢琴大师TermiPianist带你走进美妙的钢琴世界', image: 'imgHumanWithNeuralHandProsthesisPlayingPiano1.png', imageClass: 'news-image--three' },
  { x: 1418, title: '具身智能加速进入真实世界，机器人如何从“理解”走向“行动”', image: 'img7209Fbea1.png', imageClass: 'news-image--four' },
];

const newsCards = news.map((item, index) => `<article class="news-card" style="left:${item.x}px;--news-delay:${.14 + index * .06}s">
  <time datetime="2026-03-12" data-label="2026.3.12">2026.3.12</time><h3>${item.title}</h3>
  <div class="news-card__media"><img class="${item.imageClass}" src="${A}${item.image}" alt=""></div>
</article>`).join('');

const products = [
  { name: 'TermiDataCube', title: '具身数据采集系统', description: '面向机器人训练，构建高质量具身数据基础。', image: 'img11.png', mobileImage: 'img11-single.png', imageClass: 'product-card__image--datacube' },
  { name: 'TermiBrain', title: '具身大脑系列', description: '融合感知、决策与控制，驱动机器人自主作业。', image: 'img521.png', imageClass: 'product-card__image--brain' },
  { name: 'TermiBot', title: '具身硬件系列', description: '面向多场景任务，实现自主导航与精细作业。', image: 'img21.png', imageClass: 'product-card__image--bot' },
  { name: 'TermiMaster', title: '多机集群作业平台', description: '统一管理异构设备，实现多机智能协同。', image: 'termimaster-dashboard.png', imageClass: 'product-card__image--master' },
];

const productCards = products.map((item, index) => `<article class="product-card product-card--${index + 1}" data-product-index="${index}">
  <span class="product-card__surface" aria-hidden="true"></span>
  <div class="product-card__media"><picture>${item.mobileImage ? `<source media="(max-width: 1024px)" srcset="${A}${item.mobileImage}">` : ''}<img class="${item.imageClass}" src="${A}${item.image}" alt="${item.name} ${item.title}"></picture></div>
  <div class="product-card__copy"><p>${item.name}</p><h3>${item.title}</h3><span>${item.description}</span></div>
  <a class="product-arrow" href="#products" aria-label="了解 ${item.name}"><img class="product-arrow__icon product-arrow__icon--leave" src="${A}imgFrame2.svg" alt=""><img class="product-arrow__icon product-arrow__icon--enter" src="${A}imgFrame2.svg" alt=""></a>
</article>`).join('');

document.querySelector('#app').innerHTML = `
  <div class="viewport"><main class="canvas" id="canvas">
    <section class="hero" id="home" data-figma-node="176:3">
      <video class="hero__video" poster="${A}hero-earth.png" autoplay muted loop playsinline preload="auto" aria-hidden="true">
        <source src="${A}hero-video.mp4" type="video/mp4">
      </video>
      <span class="hero__veil" aria-hidden="true"></span>
      <img class="hero__glow" src="${A}imgRectangle1430107004.png" alt="">
      <header class="header header--top">
        <div class="header__bar">
          <a class="brand" href="#home" aria-label="TermiTech 首页">
            <img class="brand__image brand__image--hero" src="${A}header-logo.png" alt="TermiTech">
            <span class="brand__image brand__image--solid" aria-hidden="true"><img src="${A}brand-symbol.png" alt=""><img src="${A}brand-word.svg" alt=""></span>
          </a>
          <button class="mobile-menu-toggle" type="button" aria-label="打开导航" aria-expanded="false"><i></i><i></i></button>
          <nav class="hero-nav" aria-label="主导航"><a href="#about" data-i18n="about">关于我们</a><a href="#products" data-i18n="products">产品中心</a><a href="#solutions" data-i18n="solutions">解决方案</a><a href="#partners" data-i18n="cases">案例中心</a><a href="#news" data-i18n="news">新闻动态</a><a href="#footer" data-i18n="join">加入我们</a><div class="hero-nav__languages" aria-label="语言切换"><button type="button" data-language="zh">中文</button><button type="button" data-language="en">EN</button></div></nav>
          <div class="language-picker">
            <button class="language-picker__trigger" type="button" aria-haspopup="listbox" aria-expanded="false"><span>中</span><i aria-hidden="true"></i></button>
            <div class="language-picker__menu" role="listbox" aria-label="语言选择">
              <button class="is-active" type="button" role="option" aria-selected="true" data-language="zh">中文</button>
              <button type="button" role="option" aria-selected="false" data-language="en">英文</button>
            </div>
          </div>
          <a class="contact-link" href="#explore"><span class="contact-copy"><span class="contact-copy__upper" data-i18n="contact">联系我们</span><span class="contact-copy__lower" data-i18n="contact" aria-hidden="true">联系我们</span></span><span class="contact-arrow" aria-hidden="true"><img class="contact-arrow__upper" src="${A}imgFrame.svg" alt=""><img class="contact-arrow__lower" src="${A}imgFrame.svg" alt=""></span></a>
        </div>
      </header>
      <h1 data-i18n="heroTitle">在晨昏交织处，智能觉醒</h1>
      <p class="hero__intro" data-i18n="heroIntro">晨昏线专注于精密柔性操作与具身智能技术研发，让智能系统从感知走向执行，<br>实现复杂环境下更加自然、高效的智能交互。</p>
      <div class="hero__action">${action('探索解决方法', '#solutions', 'dark')}</div>
      <div class="hero-cards" tabindex="0" aria-label="机器人自主作业视频卡片，悬停或聚焦展开">
        <article class="hero-card hero-card--back" tabindex="0" aria-label="播放灵巧操作视频" data-video="${A}hero-video.mp4">
          <div class="hero-card__media"><img src="${A}imgHumanWithNeuralHandProsthesisPlayingPiano1.png" alt="灵巧机械手精细操作"><span class="hero-card__play" aria-hidden="true"></span></div>
          <p data-i18n="cardBack">灵巧操作与多模态协同：<br>机器人精细作业演示</p><time>03:28</time>
        </article>
        <article class="hero-card hero-card--middle" tabindex="0" aria-label="播放柔性分拣视频" data-video="${A}hero-video.mp4">
          <div class="hero-card__media"><img src="${A}imgRobotArmPicksUpBoxAutonomousRobot1.png" alt="机器人柔性分拣"><span class="hero-card__play" aria-hidden="true"></span></div>
          <p data-i18n="cardMiddle">精密分拣与柔性抓取：<br>具身智能产线实测</p><time>05:46</time>
        </article>
        <article class="hero-card hero-card--front" tabindex="0" aria-label="播放机器人自主作业视频" data-video="${A}hero-video.mp4">
          <div class="hero-card__media"><img src="${A}imgKvDesktop1.png" alt="机器人自主作业实录"><span class="hero-card__play" aria-hidden="true"></span></div>
          <p data-i18n="cardFront">从感知、决策到执行：<br>机器人自主作业实录</p><time>08:12</time>
        </article>
      </div>
      <div class="hero-player" role="dialog" aria-modal="true" aria-label="机器人作业视频播放器" aria-hidden="true" hidden>
        <button class="hero-player__close" type="button" aria-label="关闭视频">×</button>
        <div class="hero-player__frame"><video controls playsinline preload="metadata"></video></div>
      </div>
    </section>

    <section class="products" id="products" data-figma-node="154:14">
      <div class="products__stage">
        ${sectionTitle('Product Series', '产品系列')}
        <div class="products__action">${action('了解更多', '#products')}</div>
        <div class="products__track">${productCards}</div>
        <div class="products__progress" aria-hidden="true"><span></span></div>
      </div>
    </section>

    <section class="embodied-loop" id="embodied-loop" data-figma-node="176:452" data-active-orb="left">
      <div class="embodied-loop__ghost" aria-hidden="true">termi</div>
      ${sectionTitle('Embodied Loop', '具身闭环')}
      <p class="embodied-loop__lead">系列产品覆盖机器人<span>训练，</span><span>作业，</span><span>管控</span>全生命周期</p>

      <div class="loop-step">
        <img class="loop-step__line" src="${A}loop-line.svg" alt="">
        <img class="loop-step__dot" src="${A}loop-dot.svg" alt="">
        <span class="loop-step__index">02</span>
        <h3>模型迭代</h3>
        <p>以TermiBrain(机器人大脑)与TermiBot(灵巧机器人)为核心,让模型实现跨具身本体,跨算力平台部署,基于先进的infra提升推理速度,让机器人具备强交互能力,有效完成长程精细化作业。</p>
      </div>

      <svg class="embodied-loop__waves" viewBox="0 0 1920 151" preserveAspectRatio="none" aria-hidden="true">
        <path class="loop-wave loop-wave--dark" data-wave-line="0"></path>
        <path class="loop-wave loop-wave--orange" data-wave-line="1"></path>
        <path class="loop-wave loop-wave--lavender" data-wave-line="2"></path>
        <circle class="loop-wave-dot loop-wave-dot--dark" data-wave-dot="0" data-wave-x="143" r="5"></circle>
        <circle class="loop-wave-dot loop-wave-dot--dark" data-wave-dot="0" data-wave-x="1281" r="5"></circle>
        <circle class="loop-wave-dot loop-wave-dot--orange" data-wave-dot="1" data-wave-x="612" r="5"></circle>
        <circle class="loop-wave-dot loop-wave-dot--orange" data-wave-dot="1" data-wave-x="1759" r="5"></circle>
        <circle class="loop-wave-dot loop-wave-dot--lavender" data-wave-dot="2" data-wave-x="652" r="5"></circle>
        <circle class="loop-wave-dot loop-wave-dot--lavender" data-wave-dot="2" data-wave-x="1265" r="5"></circle>
      </svg>

      <div class="loop-orbs" aria-label="拖动切换具身闭环产品">
      <div class="loop-orbs__track">
      <div class="loop-orb loop-orb--left">
        <img class="loop-orb__surface" src="${A}loop-circle-200.svg" alt="">
        <div class="loop-orb__crop"><img src="${A}loop-datacube-right.png" alt="TermiBot 灵巧机器人"></div>
      </div>
      <span class="loop-orb-hover-ring loop-orb-hover-ring--left" aria-hidden="true"></span>
      <div class="loop-hover-detail loop-hover-detail--left" aria-hidden="true">
        <span class="loop-hover-detail__line"></span>
        <span class="loop-hover-detail__dot"></span>
        <span class="loop-hover-detail__index">01</span>
        <div class="loop-hover-detail__copy">
          <h3>数据积累</h3>
          <p><span>TermiDataCube为核心,提供任务驱动的具身数据采集能力。</span><span>解决行业“真机数据稀缺、获取成本高”的痛点,</span><span>定义数据范式,提升数据质量,加速数据获取,</span><span>为大脑持续提供高质量的训练“燃料”。</span></p>
        </div>
      </div>
      <div class="loop-orb loop-orb--center">
        <img class="loop-orb__surface" src="${A}loop-circle-240.svg" alt="">
        <div class="loop-orb__crop"><img src="${A}loop-hand.png" alt="灵巧手"></div>
      </div>
      <img class="loop-orb__ring" src="${A}loop-center-ring.png" alt="">
      <div class="loop-orb loop-orb--right">
        <img class="loop-orb__surface" src="${A}loop-circle-200.svg" alt="">
        <div class="loop-orb__crop"><img src="${A}loop-datacube-left.png" alt="TermiDataCube 具身数据采集设备"></div>
      </div>
      <span class="loop-orb-hover-ring loop-orb-hover-ring--right" aria-hidden="true"></span>
      <div class="loop-hover-detail loop-hover-detail--right" aria-hidden="true">
        <span class="loop-hover-detail__line"></span>
        <span class="loop-hover-detail__dot"></span>
        <span class="loop-hover-detail__index">03</span>
        <div class="loop-hover-detail__copy">
          <h3>场景验证</h3>
          <p><span>以TermiMaster为核心,从单体智能到群体智能</span><span>支撑多机器人规模化作业,通过场景数据实现数据飞轮</span><span>与具身模型重训练,使具身模型自学习自演进。</span></p>
        </div>
      </div>
      </div>
      </div>
    </section>

    <section class="solutions" id="solutions" data-figma-node="131:1060">
      <div class="solutions__stage">
        <h2 class="solutions__typewriter" aria-label="Built for the Real World"><span class="solutions__title-line">${typewriterMarkup('Built for the ', 0, 24)}</span><span class="solutions__title-line solutions__title-line--real">${typewriterMarkup('Real World', 14, 24)}</span></h2>
        <div class="solutions__stack">
          <article class="solution-scene solution-scene--one" style="--scene-index:0">
            <div class="solution-scene__media"><img src="${A}imgRobotArmPicksUpBoxAutonomousRobot1.png" alt="智能机器人柔性分拣作业"></div>
            <div class="solution-scene__copy">
              <h3>智能分拣</h3>
              <p>通过视觉感知与自主决策闭环，让机器人在复杂产线中完成柔性识别、抓取与分流。</p>
            </div>
          </article>
          <article class="solution-scene solution-scene--two" style="--scene-index:1">
            <div class="solution-scene__media"><img src="${A}img3DRenderingIndustry40Concept1.png" alt="机器人灵巧协作作业"></div>
            <div class="solution-scene__copy">
              <h3>灵巧协作</h3>
              <p>融合具身大脑与精细控制能力，让机器人在开放环境中理解任务并完成稳定操作。</p>
            </div>
          </article>
          <article class="solution-scene solution-scene--three" style="--scene-index:2">
            <div class="solution-scene__media"><img src="${A}imgWecomTemp4550991F142Db8Cb3Ba936Cec68D87Aad49C3A71.png" alt="多机集群协同作业平台"></div>
            <div class="solution-scene__veil" aria-hidden="true"></div>
            <div class="solution-scene__final">
              <h3>多机协同，释放群体智能</h3>
              <p>让设备、任务与场景在统一平台中高效联动。</p>
              ${action('了解更多', '#explore', 'glass')}
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="about" id="about" data-figma-node="176:268">
      <div class="about__background"><img src="${A}imgTheGlobalTravelAndTourismIndustryIsResponsibleForAbout45BillionTonsOfEquivalentCarbonDioxideEmissionsAYear1.png" alt=""><span></span></div>
      ${sectionTitle('about us', '关于我们', true)}
      <p class="about__intro">晨昏线科技致力于构建具身机器人大脑，以跨本体、跨品牌的通用适配能力为己任，打破硬件壁垒，让智能真正流动。</p>
      <div class="about__action">${action('了解更多', '#about', 'glass')}</div>
      <div class="metrics-grid">
        <div class="metric" style="left:80px;--metric-color:#FF8700;--metric-index:0"><strong>20+</strong><span>硬件厂商</span></div>
        <div class="metric" style="left:526px;--metric-color:#8D81FF;--metric-index:1"><strong>10+</strong><span>场景落地</span></div>
        <div class="metric" style="left:972px;--metric-color:#3F3DDD;--metric-index:2"><strong>5000万+</strong><span>成交订单</span></div>
        <div class="metric" style="left:1418px;--metric-color:#FF8700;--metric-index:3"><strong>近1亿元</strong><span>融资</span></div>
      </div>
    </section>

    <section class="partners-news" id="partners" data-figma-node="200:577">
      ${sectionTitle('our partners', '合作伙伴')}
      <p class="partners-lead">携手行业伙伴，共同推动具身智能技术走向更广泛的真实应用。</p>
      <div class="partner-grid">${partnerCells}</div>
      <div class="news-title" id="news">${sectionTitle('Latest Updates', '最新动态')}</div>
      <div class="news-action">${action('了解更多', '#news')}</div>
      <div class="news-grid">${newsCards}</div>
    </section>

    <section class="explore" id="explore" data-figma-node="176:431">
      <img class="explore__background" src="${A}img011.png" alt=""><span class="explore__shade"></span>
      <div class="explore__ghost">explore more</div><h2>探索智能未来的更多可能</h2>
      <div class="explore__action">${action('联系我们', '#footer', 'glass')}</div>
      <img class="explore__orbit" src="${A}imgEllipse12.svg" alt="">
    </section>

    <footer class="footer" id="footer" data-figma-node="176:165">
      <nav class="footer-nav"><div><a href="#home">首页</a><a href="#about">关于我们</a><a href="#products">产品中心</a><a href="#solutions">解决方案</a></div><div><a href="#news">新闻动态</a><a href="#footer">加入我们</a><a href="#explore">联系我们</a><a href="#partners">案例中心</a></div></nav>
      <div class="footer-contact"><div><span>邮箱</span><a href="mailto:contact@termitech.cn">contact@termitech.cn</a></div><div><span>地址</span><p>广东省深圳市坪山区龙田街道竹坑社区聚和路8号多彩硅谷</p></div></div>
      <div class="footer-legal"><a href="#footer">服务条款</a><a href="#footer">隐私政策</a><p>© 2026,TermiTech. All Rights Reserved.</p><img class="footer-social-row" src="${A}imgGroup2085661577.svg" alt="社交媒体"><img class="footer-social-x" src="${A}social-x.svg" alt="X"></div>
      <div class="footer-mark">
        <img class="footer-mark__symbol" src="${A}imgGroup2090054754.svg" alt="">
        <img class="footer-mark__word" src="${A}imgGroup1.svg" alt="TermiTech">
        <span class="footer-mark__scan footer-mark__scan--glow-far" aria-hidden="true"></span>
        <span class="footer-mark__scan footer-mark__scan--glow-mid" aria-hidden="true"></span>
        <span class="footer-mark__scan footer-mark__scan--glow-near" aria-hidden="true"></span>
        <span class="footer-mark__scan footer-mark__scan--line" aria-hidden="true"></span>
      </div>
    </footer>
  </main></div>`;

const canvas = document.querySelector('#canvas');
const viewport = document.querySelector('.viewport');
const DESIGN_WIDTH = 1920;
const SCREEN_HEIGHT = 1080;
const SCREEN_SECTION_COUNT = 5;
const PRODUCT_LOOP_OVERLAP = 160;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const productsSection = document.querySelector('.products');
const productsStage = document.querySelector('.products__stage');
const productsTrack = document.querySelector('.products__track');
const productCardElements = [...document.querySelectorAll('.product-card')];
const embodiedLoopSection = document.querySelector('.embodied-loop');
const solutionsSection = document.querySelector('.solutions');
const solutionsStage = document.querySelector('.solutions__stage');
const solutionsTypewriter = document.querySelector('.solutions__typewriter');
const solutionsTitleChars = [...document.querySelectorAll('.solutions__type-char')];
const solutionsTitleLetters = solutionsTitleChars.filter(character => (
  !character.classList.contains('solutions__type-char--space')
));
const solutionScenes = [...document.querySelectorAll('.solution-scene')];
const solutionSceneProgress = solutionScenes.map(() => 0);
let solutionTitleProgress = 0;
const aboutSection = document.querySelector('.about');
const aboutMetrics = [...document.querySelectorAll('.metric')];
let aboutCharSequence = 0;
aboutMetrics.forEach(metric => {
  metric.style.setProperty('--metric-reveal-delay', '.2s');
  const number = metric.querySelector('strong');
  const label = number.textContent;
  number.setAttribute('aria-label', label);
  number.textContent = '';
  [...label].forEach((character, index) => {
    const glyph = document.createElement('span');
    glyph.className = 'metric__char';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.style.setProperty('--char-index', index);
    glyph.style.setProperty('--char-delay', `${.18 + aboutCharSequence * .07}s`);
    aboutCharSequence += 1;
    glyph.textContent = character;
    number.append(glyph);
  });
});
const loopWavePaths = [...document.querySelectorAll('[data-wave-line]')];
const loopWaveDots = [...document.querySelectorAll('[data-wave-dot]')];
const loopOrbsViewport = document.querySelector('.loop-orbs');
const loopOrbsTrack = document.querySelector('.loop-orbs__track');
const loopInteractiveOrbs = [...document.querySelectorAll('.loop-orb--left, .loop-orb--center, .loop-orb--right')];
const loopStep = document.querySelector('.loop-step');
const loopStepLine = loopStep.querySelector('.loop-step__line');
const loopStepIndex = loopStep.querySelector('.loop-step__index');
const loopStepTitle = loopStep.querySelector('h3');
const loopStepDescription = loopStep.querySelector('p');
const mobileLoopCopy = [
  {
    index: '01',
    title: '数据积累',
    description: '以TermiDataCube为核心，提供任务驱动的具身数据采集能力，解决真机数据稀缺、获取成本高的痛点，为模型持续提供高质量训练数据。',
  },
  {
    index: '02',
    title: '模型迭代',
    description: '以TermiBrain（机器人大脑）与TermiBot（灵巧机器人）为核心，让模型实现跨具身本体、跨算力平台部署，提升推理速度与交互能力。',
  },
  {
    index: '03',
    title: '场景验证',
    description: '以TermiMaster为核心，从单体智能走向群体智能，支撑多机器人规模化作业，并通过场景数据推动模型持续学习与演进。',
  },
];
let mobileLoopIndex = 1;
let mobileLoopPointer = null;
let mobileLoopTappedOrb = null;
let mobileLoopStartX = 0;
let mobileLoopDragX = 0;
let renderedMobileLoopIndex = null;
let mobileLoopCopyTimer = 0;
let mobileLoopExtensionTimer = 0;
function syncMobileLoopCopy(index) {
  if (!mobileFlow || renderedMobileLoopIndex === index) return;
  const copy = mobileLoopCopy[index];
  const applyCopy = () => {
    loopStepIndex.textContent = copy.index;
    loopStepTitle.textContent = copy.title;
    loopStepDescription.textContent = copy.description;
    renderedMobileLoopIndex = index;
    requestAnimationFrame(() => loopStep.classList.remove('loop-step--changing'));
  };
  clearTimeout(mobileLoopCopyTimer);
  if (renderedMobileLoopIndex === null || reduceMotion.matches) {
    applyCopy();
    return;
  }
  loopStep.classList.add('loop-step--changing');
  mobileLoopCopyTimer = setTimeout(applyCopy, 150);
}
function positionMobileLoop(index = mobileLoopIndex) {
  const previousIndex = mobileLoopIndex;
  mobileLoopIndex = Math.max(0, Math.min(loopInteractiveOrbs.length - 1, index));
  loopInteractiveOrbs.forEach((orb, orbIndex) => orb.classList.toggle('is-mobile-active', orbIndex === mobileLoopIndex));
  const sides = ['left', 'center', 'right'];
  if (mobileFlow) embodiedLoopSection.dataset.activeOrb = sides[mobileLoopIndex];
  syncMobileLoopCopy(mobileLoopIndex);
  requestAnimationFrame(() => {
    if (!mobileFlow) return;
    const activeOrb = loopInteractiveOrbs[mobileLoopIndex];
    const offset = loopOrbsViewport.clientWidth / 2 - (activeOrb.offsetLeft + activeOrb.offsetWidth / 2);
    loopOrbsTrack.style.setProperty('--loop-offset', `${offset}px`);
    loopOrbsTrack.style.setProperty('--loop-drag', '0px');
    embodiedLoopSection.style.setProperty('--loop-dot-travel', `${loopStepLine.offsetHeight}px`);
    if (previousIndex !== mobileLoopIndex) {
      clearTimeout(mobileLoopExtensionTimer);
      embodiedLoopSection.classList.remove('embodied-loop--extending');
      void embodiedLoopSection.offsetWidth;
      embodiedLoopSection.classList.add('embodied-loop--extending');
      mobileLoopExtensionTimer = setTimeout(() => {
        embodiedLoopSection.classList.remove('embodied-loop--extending');
      }, 680);
    }
  });
}
loopOrbsViewport.tabIndex = 0;
loopOrbsViewport.addEventListener('pointerdown', event => {
  if (!mobileFlow) return;
  mobileLoopPointer = event.pointerId;
  mobileLoopTappedOrb = event.target.closest?.('.loop-orb') || null;
  mobileLoopStartX = event.clientX;
  mobileLoopDragX = 0;
  loopOrbsViewport.setPointerCapture(event.pointerId);
  loopOrbsViewport.classList.add('is-dragging');
});
loopOrbsViewport.addEventListener('pointermove', event => {
  if (!mobileFlow || event.pointerId !== mobileLoopPointer) return;
  mobileLoopDragX = event.clientX - mobileLoopStartX;
  loopOrbsTrack.style.setProperty('--loop-drag', `${mobileLoopDragX}px`);
  if (Math.abs(mobileLoopDragX) > 8) event.preventDefault();
});
function finishMobileLoopDrag(event) {
  if (event.pointerId !== mobileLoopPointer) return;
  const tappedOrb = mobileLoopTappedOrb;
  if (event.type === 'pointercancel') positionMobileLoop(mobileLoopIndex);
  else if (Math.abs(mobileLoopDragX) > 44) positionMobileLoop(mobileLoopIndex + (mobileLoopDragX < 0 ? 1 : -1));
  else if (tappedOrb) positionMobileLoop(loopInteractiveOrbs.indexOf(tappedOrb));
  else positionMobileLoop(mobileLoopIndex);
  mobileLoopPointer = null;
  mobileLoopTappedOrb = null;
  mobileLoopDragX = 0;
  loopOrbsViewport.classList.remove('is-dragging');
}
loopOrbsViewport.addEventListener('pointerup', finishMobileLoopDrag);
loopOrbsViewport.addEventListener('pointercancel', finishMobileLoopDrag);
loopOrbsViewport.addEventListener('keydown', event => {
  if (!mobileFlow || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  positionMobileLoop(mobileLoopIndex + (event.key === 'ArrowRight' ? 1 : -1));
});
const LOOP_WAVE_WIDTH = 1920;
const loopWaveConfigs = [
  { base: 70, amplitude: 28, wavelength: 390, speed: 1.8, phase: .15, detailAmplitude: 7, detailWavelength: 920, detailSpeed: -.62 },
  { base: 78, amplitude: 20, wavelength: 470, speed: -1.5, phase: .85, detailAmplitude: 6, detailWavelength: 760, detailSpeed: .72 },
  { base: 82, amplitude: 24, wavelength: 420, speed: 1.38, phase: 2.15, detailAmplitude: 6, detailWavelength: 840, detailSpeed: -.8 },
];
loopInteractiveOrbs.forEach(orb => {
  const side = orb.classList.contains('loop-orb--left')
    ? 'left'
    : orb.classList.contains('loop-orb--center') ? 'center' : 'right';
  orb.tabIndex = 0;
  orb.setAttribute('role', 'button');
  const labels = { left: '查看数据积累', center: '查看模型迭代', right: '查看场景验证' };
  orb.setAttribute('aria-label', labels[side]);
  const activate = () => {
    if (mobileFlow) return;
    embodiedLoopSection.dataset.activeOrb = side;
  };
  orb.addEventListener('pointerenter', activate);
  orb.addEventListener('focus', activate);
});
document.querySelectorAll('.action').forEach(actionElement => {
  actionElement.addEventListener('pointerenter', () => actionElement.classList.add('is-hovered'));
  actionElement.addEventListener('pointerleave', () => actionElement.classList.remove('is-hovered'));
  actionElement.addEventListener('blur', () => actionElement.classList.remove('is-hovered'));
});
const exploreSection = document.querySelector('.explore');
const footerSection = document.querySelector('.footer');
const footerMark = document.querySelector('.footer-mark');
const languagePicker = document.querySelector('.language-picker');
const languageTrigger = document.querySelector('.language-picker__trigger');
const languageOptions = [...document.querySelectorAll('[data-language]')];
const heroTitle = document.querySelector('.hero h1');
const heroCardsGroup = document.querySelector('.hero-cards');
const heroCards = [...document.querySelectorAll('.hero-card')];
const heroPlayer = document.querySelector('.hero-player');
const heroPlayerVideo = heroPlayer.querySelector('video');
const heroPlayerClose = heroPlayer.querySelector('.hero-player__close');
let activeVideoCard = null;
let scale = innerWidth / DESIGN_WIDTH;
let layoutWidth = DESIGN_WIDTH;
let compactLayout = false;
let mobileFlow = innerWidth <= 1024;
let heroHeight = SCREEN_HEIGHT;
let productPinDistance = SCREEN_HEIGHT * 1.94;
let productReleaseDistance = SCREEN_HEIGHT * .08;
let solutionsPinDistance = SCREEN_HEIGHT * 2.2;
let current = scrollY;
let target = scrollY;
let scrollTarget = scrollY;
let appliedScrollY = scrollY;
let frame = 0;
let running = true;
let lastFrameTimestamp = performance.now();
let lastScrollY = scrollY;
let headerHidden = false;
let aboutInView = false;
let aboutColorWavePlayedInView = false;
const partnersSection = document.querySelector('.partners-news');
const newsTitle = document.querySelector('.news-title');
let partnersInView = false;
let newsInView = false;
let exploreInView = false;
let footerInView = false;
const footerGlowPointer = {
  targetX: 880,
  targetY: 140,
  currentX: 880,
  currentY: 140,
};

function updateFooterGlowTarget(event) {
  const rect = footerMark.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  footerGlowPointer.targetX = ((event.clientX - rect.left) / rect.width) * footerMark.offsetWidth;
  footerGlowPointer.targetY = ((event.clientY - rect.top) / rect.height) * footerMark.offsetHeight;
}

footerMark.addEventListener('pointerenter', event => {
  updateFooterGlowTarget(event);
  footerMark.classList.add('footer-mark--hovered');
});
footerMark.addEventListener('pointermove', updateFooterGlowTarget);
footerMark.addEventListener('pointerleave', () => footerMark.classList.remove('footer-mark--hovered'));

const translations = {
  zh: {
    about: '关于我们', products: '产品中心', solutions: '解决方案', cases: '案例中心', news: '新闻动态', join: '加入我们', contact: '联系我们',
    heroTitle: '在晨昏交织处，智能觉醒',
    heroIntro: '晨昏线专注于精密柔性操作与具身智能技术研发，让智能系统从感知走向执行，<br>实现复杂环境下更加自然、高效的智能交互。',
    heroAction: '探索解决方法',
    cardFront: '从感知、决策到执行：<br>机器人自主作业实录',
    cardMiddle: '精密分拣与柔性抓取：<br>具身智能产线实测',
    cardBack: '灵巧操作与多模态协同：<br>机器人精细作业演示',
  },
  en: {
    about: 'About Us', products: 'Products', solutions: 'Solutions', cases: 'Cases', news: 'News', join: 'Join Us', contact: 'Contact Us',
    heroTitle: 'Where Dawn Meets Dusk, Intelligence Awakens',
    heroIntro: 'TermiTech develops precision, flexible manipulation and embodied intelligence,<br>helping intelligent systems move naturally and efficiently from perception to action.',
    heroAction: 'Explore Solutions',
    cardFront: 'From perception and decisions to action:<br>autonomous robot workflow',
    cardMiddle: 'Precision sorting and flexible grasping:<br>embodied AI on the production line',
    cardBack: 'Dexterous operation and multimodal control:<br>precision robot demonstration',
  },
};

function renderHeroTitle(text) {
  heroTitle.classList.remove('is-revealed');
  heroTitle.textContent = '';
  [...text].forEach((character, index) => {
    const span = document.createElement('span');
    span.className = character === ' ' ? 'title-char title-char--space' : 'title-char';
    span.textContent = character === ' ' ? '\u00a0' : character;
    const sequence = (index * 7) % Math.max(text.length, 1);
    span.style.setProperty('--title-delay', `${80 + sequence * 28}ms`);
    heroTitle.append(span);
    if (character === '，' || character === ',') {
      const mobileBreak = document.createElement('span');
      mobileBreak.className = 'title-mobile-break';
      mobileBreak.setAttribute('aria-hidden', 'true');
      heroTitle.append(mobileBreak);
    }
  });
  requestAnimationFrame(() => requestAnimationFrame(() => heroTitle.classList.add('is-revealed')));
}

function applyLanguage(language) {
  const copy = translations[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (key === 'heroTitle') return;
    if (copy[key]) element.innerHTML = copy[key];
  });
  document.querySelectorAll('.hero__action .action__label-copy').forEach(element => {
    element.textContent = copy.heroAction;
  });
  languageTrigger.querySelector('span').textContent = language === 'zh' ? '中' : 'EN';
  languageOptions.forEach(option => {
    const active = option.dataset.language === language;
    option.classList.toggle('is-active', active);
    option.setAttribute('aria-selected', String(active));
  });
  renderHeroTitle(copy.heroTitle);
  languagePicker.classList.remove('is-open');
  languageTrigger.setAttribute('aria-expanded', 'false');
}

function setLanguageMenu(open) {
  languagePicker.classList.toggle('is-open', open);
  languageTrigger.setAttribute('aria-expanded', String(open));
}

function openHeroVideo(card) {
  activeVideoCard = card;
  heroPlayerVideo.src = card.dataset.video;
  heroPlayer.hidden = false;
  heroPlayer.setAttribute('aria-hidden', 'false');
  heroPlayerVideo.play().catch(() => {});
  heroPlayerClose.focus();
}

function closeHeroVideo() {
  if (heroPlayer.hidden) return;
  heroPlayerVideo.pause();
  heroPlayerVideo.removeAttribute('src');
  heroPlayerVideo.load();
  heroPlayer.hidden = true;
  heroPlayer.setAttribute('aria-hidden', 'true');
  activeVideoCard?.focus();
  activeVideoCard = null;
}

languageTrigger.addEventListener('click', event => {
  event.stopPropagation();
  setLanguageMenu(!languagePicker.classList.contains('is-open'));
});
languageOptions.forEach(option => option.addEventListener('click', () => applyLanguage(option.dataset.language)));
heroCards.forEach(card => {
  card.addEventListener('click', () => openHeroVideo(card));
  card.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openHeroVideo(card);
  });
});
heroCardsGroup.addEventListener('pointerleave', () => {
  if (heroCardsGroup.classList.contains('hero-cards--ready')) {
    heroCardsGroup.classList.add('hero-cards--interactive');
  }
});
heroPlayerClose.addEventListener('click', closeHeroVideo);
heroPlayer.addEventListener('click', event => {
  if (event.target === heroPlayer) closeHeroVideo();
});
document.addEventListener('click', event => {
  if (!languagePicker.contains(event.target)) setLanguageMenu(false);
  if (!header.contains(event.target)) {
    header.classList.remove('header--menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', '打开导航');
  }
});
mobileMenuToggle.addEventListener('click', () => {
  const opened = header.classList.toggle('header--menu-open');
  mobileMenuToggle.setAttribute('aria-expanded', String(opened));
  mobileMenuToggle.setAttribute('aria-label', opened ? '关闭导航' : '打开导航');
  if (opened) {
    headerHidden = false;
    header.classList.remove('header--hidden');
  }
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  setLanguageMenu(false);
  header.classList.remove('header--menu-open');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.setAttribute('aria-label', '打开导航');
  closeHeroVideo();
});

addEventListener('wheel', event => {
  if (mobileFlow || reduceMotion.matches || event.ctrlKey || Math.abs(event.deltaY) < .01) return;
  event.preventDefault();
  const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 18
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? innerHeight
      : 1;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  scrollTarget = Math.min(maxScroll, Math.max(0, scrollTarget + event.deltaY * unit * .88));
}, { passive: false });

addEventListener('scroll', () => {
  const nextScrollY = scrollY;
  if (mobileFlow) {
    headerHidden = false;
    lastScrollY = nextScrollY;
    header.classList.remove('header--hidden');
    header.classList.toggle('header--solid', nextScrollY > 4);
    header.classList.toggle('header--top', nextScrollY <= 4);
    return;
  }
  if (Math.abs(nextScrollY - appliedScrollY) > 2) scrollTarget = nextScrollY;
  const delta = nextScrollY - lastScrollY;
  if (nextScrollY <= 4) headerHidden = false;
  else if (delta > 3 && nextScrollY > 80) headerHidden = true;
  else if (delta < -3) headerHidden = false;
  lastScrollY = nextScrollY;
  header.classList.toggle('header--hidden', headerHidden);
  header.classList.toggle('header--solid', nextScrollY > 4);
  header.classList.toggle('header--top', nextScrollY <= 4);
}, { passive: true });

applyLanguage('zh');
setTimeout(() => hero.classList.add('hero--entered'), reduceMotion.matches ? 0 : 140);
setTimeout(() => {
  heroCardsGroup.classList.add('hero-cards--ready', 'hero-cards--interactive');
}, reduceMotion.matches ? 0 : 420);

function updateMetrics() {
  mobileFlow = innerWidth <= 1024;
  compactLayout = innerWidth <= 1024;
  layoutWidth = compactLayout ? innerWidth : DESIGN_WIDTH;
  scale = compactLayout ? 1 : Math.min(1, innerWidth / DESIGN_WIDTH);
  const canvasOffset = innerWidth > DESIGN_WIDTH ? (innerWidth - DESIGN_WIDTH) / 2 : 0;
  canvas.style.left = `${canvasOffset}px`;
  canvas.style.setProperty('--layout-width', `${layoutWidth}px`);
  canvas.dataset.viewport = innerWidth <= 900
    ? 'mobile'
    : innerWidth <= 1024
      ? 'tablet'
      : innerWidth <= 1199
        ? 'compact'
        : innerWidth <= 1366
          ? 'laptop'
          : innerWidth <= 1920 ? 'desktop' : 'wide';
  const naturalScreenHeight = innerHeight / scale;
  const compactScreenCap = innerWidth <= 900
    ? Math.max(720, layoutWidth * 1.35)
    : Math.max(760, layoutWidth * 1.15);
  if (mobileFlow) {
    heroHeight = Math.min(820, Math.max(680, innerHeight));
    productPinDistance = 0;
    productReleaseDistance = 0;
    solutionsPinDistance = 0;
    canvas.style.setProperty('--hero-height', `${heroHeight}px`);
    canvas.style.setProperty('--screen-height', `${heroHeight}px`);
    canvas.style.setProperty('--screen-ratio', '1');
    productsSection.style.setProperty('--products-height', 'auto');
    solutionsSection.style.setProperty('--solutions-height', 'auto');
    canvas.style.height = 'auto';
    document.body.style.height = 'auto';
    positionMobileLoop(mobileLoopIndex);
    return;
  }
  // Keep the desktop banner exactly one physical viewport tall at every
  // supported aspect ratio. The canvas is width-scaled, so its design-space
  // height must be the viewport height divided by that scale.
  heroHeight = naturalScreenHeight;
  productPinDistance = heroHeight * (compactLayout ? 2.4 : .62);
  productReleaseDistance = heroHeight * .04;
  solutionsPinDistance = heroHeight * (compactLayout ? 2.05 : 1.8);
  canvas.style.setProperty('--hero-height', `${heroHeight}px`);
  canvas.style.setProperty('--screen-height', `${heroHeight}px`);
  canvas.style.setProperty('--screen-ratio', `${compactLayout ? 1 : Math.min(1, heroHeight / SCREEN_HEIGHT)}`);
  productsSection.style.setProperty('--products-height', `${heroHeight + productPinDistance}px`);
  solutionsSection.style.setProperty('--solutions-height', `${heroHeight + solutionsPinDistance}px`);
  const nonScreenHeight = partnersSection.offsetHeight + exploreSection.offsetHeight + footerSection.offsetHeight;
  const canvasDesignHeight = nonScreenHeight + heroHeight * SCREEN_SECTION_COUNT
    + productPinDistance + solutionsPinDistance - PRODUCT_LOOP_OVERLAP;
  canvas.style.height = `${canvasDesignHeight}px`;
  document.body.style.height = `${Math.max(innerHeight, canvasDesignHeight * scale)}px`;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
  scrollTarget = Math.min(maxScroll, Math.max(0, scrollTarget));
}

function loopWaveY(config, x, time) {
  const primary = Math.sin((x / config.wavelength) * Math.PI * 2 - time * config.speed + config.phase);
  const detail = Math.sin((x / config.detailWavelength) * Math.PI * 2 - time * config.detailSpeed + config.phase * 1.7);
  return config.base + primary * config.amplitude + detail * config.detailAmplitude;
}

function renderLoopWaves(timestamp) {
  const time = reduceMotion.matches ? 0 : timestamp / 1000;
  loopWavePaths.forEach((path, index) => {
    const config = loopWaveConfigs[index];
    let pathData = '';
    for (let x = 0; x <= LOOP_WAVE_WIDTH; x += 12) {
      const y = loopWaveY(config, x, time);
      pathData += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(2)} `;
    }
    path.setAttribute('d', pathData);
  });
  loopWaveDots.forEach(dot => {
    const waveIndex = Number(dot.dataset.waveDot);
    const x = Number(dot.dataset.waveX);
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', loopWaveY(loopWaveConfigs[waveIndex], x, time).toFixed(2));
  });
}

function mobileSectionVisible(section, threshold = .86) {
  const rect = section.getBoundingClientRect();
  return rect.top < innerHeight * threshold && rect.bottom > innerHeight * .08;
}

function renderMobile(timestamp) {
  current = scrollY;
  target = scrollY;
  scrollTarget = scrollY;
  appliedScrollY = scrollY;
  productsStage.style.transform = 'none';
  productsTrack.style.transform = 'none';
  productCardElements.forEach(card => {
    card.style.transform = 'none';
    card.style.clipPath = 'none';
  });
  solutionsStage.style.transform = 'none';
  const mobileTitleRect = solutionsTypewriter.getBoundingClientRect();
  const mobileTitleStart = innerHeight * .92;
  const mobileTitleEnd = innerHeight * .52;
  const mobileTitleProgress = Math.min(1, Math.max(0,
    (mobileTitleStart - mobileTitleRect.top) / Math.max(1, mobileTitleStart - mobileTitleEnd),
  ));
  solutionsTitleChars.forEach(character => {
    if (!character.classList.contains('solutions__type-char--space')) return;
    character.style.opacity = '1';
    character.style.transform = 'none';
  });
  solutionsTitleLetters.forEach((character, index) => {
    const staggerOffset = solutionsTitleLetters.length > 1
      ? (index / (solutionsTitleLetters.length - 1)) * .55
      : 0;
    const characterProgress = reduceMotion.matches ? mobileTitleProgress : Math.min(1, Math.max(0,
      (mobileTitleProgress - staggerOffset) / .45,
    ));
    const opacityProgress = 1 - (1 - characterProgress) ** 3;
    character.style.opacity = opacityProgress.toFixed(4);
    character.style.transform = `translate3d(0, ${((1 - backOut(characterProgress)) * 34).toFixed(2)}px, 0)`;
  });
  productsSection.classList.add('products--entered');
  embodiedLoopSection.classList.add('embodied-loop--entered');
  renderLoopWaves(timestamp);
  const nextAboutInView = mobileSectionVisible(aboutSection);
  if (nextAboutInView !== aboutInView) {
    aboutInView = nextAboutInView;
    aboutSection.classList.toggle('about--entered', aboutInView);
    if (!aboutInView) {
      aboutColorWavePlayedInView = false;
      aboutSection.classList.remove('about--color-wave');
    }
  }
  if (aboutInView && !aboutColorWavePlayedInView && aboutSection.getBoundingClientRect().top < innerHeight * .48) {
    aboutColorWavePlayedInView = true;
    aboutSection.classList.add('about--color-wave');
  }
  partnersInView = true;
  newsInView = true;
  partnersSection.classList.add('partners-news--entered', 'partners-news--news-entered');
  exploreInView = true;
  exploreSection.classList.add('explore--entered');
  footerInView = true;
  footerSection.classList.add('footer--entered');
  viewport.style.background = scrollY < heroHeight ? '#000' : '#fff';
  canvas.style.transform = 'none';
  header.style.transform = 'none';
}

function render(timestamp = performance.now()) {
  if (!running) return;
  const deltaTime = Math.min(48, Math.max(1, timestamp - lastFrameTimestamp));
  lastFrameTimestamp = timestamp;
  const footerGlowBlend = reduceMotion.matches ? 1 : 1 - Math.exp(-deltaTime / 78);
  footerGlowPointer.currentX += (footerGlowPointer.targetX - footerGlowPointer.currentX) * footerGlowBlend;
  footerGlowPointer.currentY += (footerGlowPointer.targetY - footerGlowPointer.currentY) * footerGlowBlend;
  footerMark.style.setProperty('--footer-glow-x', `${footerGlowPointer.currentX.toFixed(2)}px`);
  footerMark.style.setProperty('--footer-glow-y', `${footerGlowPointer.currentY.toFixed(2)}px`);
  if (mobileFlow) {
    renderMobile(timestamp);
    frame = requestAnimationFrame(render);
    return;
  }
  target = scrollTarget;
  if (reduceMotion.matches) current = target;
  else {
    const distance = target - current;
    const inputPosition = target / scale;
    const insideProducts = inputPosition > heroHeight * .82
      && inputPosition < heroHeight + productPinDistance + heroHeight * .16;
    const solutionsTop = solutionsSection.offsetTop;
    const insideSolutions = inputPosition > solutionsTop - heroHeight * .2
      && inputPosition < solutionsTop + solutionsPinDistance + heroHeight * .25;
    const scrollBlend = 1 - Math.exp(-deltaTime / (insideProducts ? 198 : insideSolutions ? 184 : 176));
    current += distance * scrollBlend;
    if (Math.abs(distance) < 0.05) current = target;
  }
  appliedScrollY = current;
  if (Math.abs(scrollY - current) > .08) scrollTo({ top: current, behavior: 'auto' });
  const designScroll = current / scale;
  const productsTop = heroHeight;
  const productsLocal = Math.min(productPinDistance, Math.max(0, designScroll - productsTop));
  const travelDistance = Math.max(1, productPinDistance - productReleaseDistance);
  const travelProgress = Math.min(1, Math.max(0, productsLocal / travelDistance));
  const alignProgress = travelProgress;
  const compactCardStep = Math.max(320, layoutWidth - 24);
  const horizontalShift = (compactLayout ? compactCardStep * 3 : 792) * travelProgress;
  const surfaceTops = compactLayout ? [190, 190, 190, 190] : [274, 329, 369, 409];
  const initialOffsets = compactLayout ? [0, 0, 0, 0] : [0, 40, 60, 80];
  const finalSurfaceTop = compactLayout ? 190 : 334;
  const releaseLocal = Math.max(0, productsLocal - travelDistance);
  const releaseProgress = productReleaseDistance
    ? Math.min(1, releaseLocal / productReleaseDistance)
    : 1;
  const stageShift = productsLocal <= travelDistance
    ? productsLocal
    : travelDistance + productReleaseDistance * (releaseProgress - .5 * releaseProgress * releaseProgress);
  productsStage.style.transform = `translate3d(0, ${stageShift}px, 0)`;
  productsTrack.style.transform = `translate3d(${-horizontalShift}px,0,0)`;
  productsSection.classList.toggle('products--entered', designScroll > productsTop - heroHeight * .55 && designScroll < productsTop + productPinDistance + heroHeight);
  productCardElements.forEach((card, index) => {
    const finalOffset = finalSurfaceTop - surfaceTops[index];
    const y = initialOffsets[index] + (finalOffset - initialOffsets[index]) * alignProgress;
    card.style.transform = `translate3d(0, ${y}px, 0)`;
    card.style.clipPath = 'none';
  });
  const embodiedLoopTop = embodiedLoopSection.offsetTop;
  const embodiedLoopVisible = designScroll > embodiedLoopTop - heroHeight * .82
    && designScroll < embodiedLoopTop + heroHeight * 1.04;
  embodiedLoopSection.classList.toggle('embodied-loop--entered', embodiedLoopVisible);
  renderLoopWaves(timestamp);
  const solutionsTop = solutionsSection.offsetTop;
  const solutionsLocal = Math.min(solutionsPinDistance, Math.max(0, designScroll - solutionsTop));
  const solutionsInterval = solutionsPinDistance / solutionScenes.length;
  solutionsStage.style.transform = `translate3d(0, ${solutionsLocal}px, 0)`;
  // ScrollFloat-style scrub: the reveal is tied to the user's scroll position,
  // so it cannot finish off-screen or be missed after a fast wheel gesture.
  // Keep the reveal inside the visible composition. It begins only after the
  // heading reaches the middle/lower viewport and finishes after the stage pins.
  const titleRevealStart = solutionsTop - heroHeight * .84;
  const titleRevealEnd = solutionsTop - heroHeight * .02;
  const titleRevealTarget = Math.min(1, Math.max(0,
    (designScroll - titleRevealStart) / Math.max(1, titleRevealEnd - titleRevealStart),
  ));
  if (reduceMotion.matches) solutionTitleProgress = titleRevealTarget;
  else {
    const titleBlend = 1 - Math.exp(-deltaTime / 62);
    solutionTitleProgress += (titleRevealTarget - solutionTitleProgress) * titleBlend;
    if (Math.abs(titleRevealTarget - solutionTitleProgress) < .0001) {
      solutionTitleProgress = titleRevealTarget;
    }
  }
  const titleRevealProgress = solutionTitleProgress;
  const solutionLetters = solutionsTitleChars.filter(character => (
    !character.classList.contains('solutions__type-char--space')
  ));
  solutionsTitleChars.forEach(character => {
    if (!character.classList.contains('solutions__type-char--space')) return;
    character.style.opacity = '1';
    character.style.transform = 'none';
  });
  solutionLetters.forEach((character, index) => {
    const staggerOffset = solutionLetters.length > 1
      ? (index / (solutionLetters.length - 1)) * .72
      : 0;
    const characterProgress = Math.min(1, Math.max(0,
      (titleRevealProgress - staggerOffset) / .16,
    ));
    const motionProgress = backOut(characterProgress);
    const opacityProgress = 1 - (1 - characterProgress) ** 3;
    character.style.opacity = opacityProgress.toFixed(4);
    character.style.transform = `translate3d(0, ${((1 - motionProgress) * 24).toFixed(2)}%, 0)`;
  });
  const firstSceneStart = -heroHeight * .03;
  const sceneDuration = solutionsInterval * .46;
  const solutionsScrollProgress = solutionsLocal / Math.max(1, solutionsPinDistance);
  const sceneTargets = [
    Math.min(1, Math.max(0, (solutionsLocal - firstSceneStart) / sceneDuration)),
    Math.min(1, Math.max(0, (solutionsScrollProgress - .08) / .4)),
    Math.min(1, Math.max(0, (solutionsScrollProgress - .43) / .4)),
  ];
  const titleDrivenFirstScene = Math.min(1, Math.max(0,
    (titleRevealProgress - .3) / .4,
  ));
  const firstSceneTitleGate = Math.min(1, Math.max(0,
    (titleRevealProgress - .28) / .44,
  ));
  sceneTargets[0] = Math.min(
    Math.max(sceneTargets[0], titleDrivenFirstScene),
    firstSceneTitleGate,
  );
  sceneTargets.forEach((sceneTarget, index) => {
    if (index > 0 || reduceMotion.matches) {
      solutionSceneProgress[index] = sceneTarget;
      return;
    }
    const sceneBlend = 1 - Math.exp(-deltaTime / 205);
    solutionSceneProgress[index] += (sceneTarget - solutionSceneProgress[index]) * sceneBlend;
    if (Math.abs(sceneTarget - solutionSceneProgress[index]) < .0001) solutionSceneProgress[index] = sceneTarget;
  });
  solutionScenes.forEach((scene, index) => {
    const visualProgress = solutionSceneProgress[index];
    const easedProgress = index === 0
      ? 1 - ((1 - visualProgress) ** 3)
      : visualProgress * visualProgress * (3 - 2 * visualProgress);
    const stackDepth = Math.min(2, solutionSceneProgress
      .slice(index + 1)
      .reduce((depth, laterProgress) => depth + laterProgress, 0));
    const nextProgress = index === solutionScenes.length - 1
      ? 0
      : solutionSceneProgress[index + 1];
    const copyOpacity = index === solutionScenes.length - 1
      ? visualProgress
      : visualProgress * (1 - nextProgress);
    const sceneOpacity = visualProgress > .0001 ? 1 : 0;
    const entryY = (1 - easedProgress) * (heroHeight * .76 + index * 34);
    const stackY = stackDepth * -18;
    const entryScale = .96 + .04 * easedProgress;
    const stackScale = entryScale * (1 - stackDepth * .026);
    scene.style.setProperty('--scene-opacity', sceneOpacity.toFixed(4));
    scene.style.setProperty('--scene-y', `${(entryY + stackY).toFixed(2)}px`);
    scene.style.setProperty('--scene-z', `${(stackDepth * -70).toFixed(2)}px`);
    scene.style.setProperty('--scene-tilt', `${(stackDepth * 1.05).toFixed(3)}deg`);
    scene.style.setProperty('--scene-scale', stackScale.toFixed(4));
    scene.style.setProperty('--scene-shadow-opacity', (.18 - Math.min(1, stackDepth) * .08).toFixed(3));
    scene.style.setProperty('--copy-opacity', copyOpacity.toFixed(4));
    scene.style.setProperty('--copy-y', `${((1 - copyOpacity) * 24).toFixed(2)}px`);
  });
  const aboutTop = aboutSection.offsetTop;
  const aboutVisible = designScroll > aboutTop - heroHeight * .68
    && designScroll < aboutTop + heroHeight * .82;
  if (aboutVisible !== aboutInView) {
    aboutInView = aboutVisible;
    aboutSection.classList.toggle('about--entered', aboutInView);
    if (!aboutInView) {
      aboutColorWavePlayedInView = false;
      aboutSection.classList.remove('about--color-wave');
    }
  }
  const aboutColorWaveReady = aboutInView
    && designScroll > aboutTop - heroHeight * .05
    && designScroll < aboutTop + heroHeight * .48;
  if (aboutColorWaveReady && !aboutColorWavePlayedInView) {
    aboutColorWavePlayedInView = true;
    aboutSection.classList.add('about--color-wave');
  }
  const partnersTop = partnersSection.offsetTop;
  const partnersVisible = designScroll > partnersTop - heroHeight * .68
    && designScroll < partnersTop + heroHeight * .88;
  if (partnersVisible !== partnersInView) {
    partnersInView = partnersVisible;
    partnersSection.classList.toggle('partners-news--entered', partnersInView);
  }
  const newsTop = partnersTop + newsTitle.offsetTop;
  const newsVisible = designScroll > newsTop - heroHeight * 1.05
    && designScroll < newsTop + heroHeight * .82;
  if (newsVisible !== newsInView) {
    newsInView = newsVisible;
    partnersSection.classList.toggle('partners-news--news-entered', newsInView);
  }
  const exploreTop = exploreSection.offsetTop;
  const exploreVisible = designScroll > exploreTop - heroHeight * .72
    && designScroll < exploreTop + exploreSection.offsetHeight * .92;
  if (exploreVisible !== exploreInView) {
    exploreInView = exploreVisible;
    exploreSection.classList.toggle('explore--entered', exploreInView);
  }
  const footerTop = footerSection.offsetTop;
  const footerVisible = designScroll > footerTop - heroHeight * .78
    && designScroll < footerTop + footerSection.offsetHeight * .92;
  if (footerVisible !== footerInView) {
    footerInView = footerVisible;
    footerSection.classList.toggle('footer--entered', footerInView);
  }
  viewport.style.background = designScroll < heroHeight || designScroll >= exploreTop ? '#000' : '#fff';
  canvas.style.transform = `translate3d(0, ${-current}px, 0) scale(${scale})`;
  header.style.transform = `translate3d(0, ${designScroll}px, 0)`;
  frame = requestAnimationFrame(render);
}

function scrollToHash(hash) {
  const element = document.querySelector(hash);
  if (!element) return;
  if (mobileFlow) {
    const destination = Math.max(0, element.getBoundingClientRect().top + scrollY - 68);
    scrollTo({ top: destination, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    return;
  }
  let designTop = 0;
  for (let node = element; node && node !== canvas; node = node.offsetParent) designTop += node.offsetTop;
  const destination = designTop * scale;
  scrollTarget = destination;
  current = destination;
  target = destination;
  appliedScrollY = destination;
  scrollTo({ top: destination, behavior: 'auto' });
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  event.preventDefault();
  header.classList.remove('header--menu-open');
  mobileMenuToggle.setAttribute('aria-expanded', 'false');
  mobileMenuToggle.setAttribute('aria-label', '打开导航');
  history.replaceState(null, '', hash);
  scrollToHash(hash);
});

addEventListener('resize', updateMetrics, { passive: true });
addEventListener('hashchange', () => scrollToHash(location.hash));
addEventListener('load', () => {
  updateMetrics();
  scrollTarget = 0;
  current = 0;
  target = 0;
  appliedScrollY = 0;
  lastScrollY = 0;
  scrollTo({ top: 0, left: 0, behavior: 'auto' });
});
addEventListener('pageshow', () => {
  scrollTarget = 0;
  current = 0;
  target = 0;
  appliedScrollY = 0;
  lastScrollY = 0;
  scrollTo({ top: 0, left: 0, behavior: 'auto' });
});
new ResizeObserver(updateMetrics).observe(canvas);
document.addEventListener('visibilitychange', () => {
  running = !document.hidden;
  if (running) render(); else cancelAnimationFrame(frame);
});
updateMetrics();
render();
