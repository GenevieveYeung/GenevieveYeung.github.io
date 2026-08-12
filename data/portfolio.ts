export const links = {
  email: "mailto:genevieveyeung@gmail.com",
  phone: "tel:+85260804041",
  linkedin: "https://www.linkedin.com/in/siu-kwun-yeung-114b4b2b7",
  jobsdb: "https://hk.jobsdb.com/profiles/siukwun-yeung-bstvmqtfcs",
  xiaohongshu: "https://www.xiaohongshu.com/user/profile/5c28979b000000000501f290?xsec_token=YBJHKc3JttUBchJqVZsD8jlf8UoWTUV-lOVtUkcim0Q9E=&xsec_source=app_share&xhsshare=WeixinSession&appuid=5c28979b000000000501f290&apptime=1786347824&share_id=83aeb314271c4afda9808224638087ec",
};

export const profile = {
  name: "Genevieve Yeung",
  location: "Hong Kong",
  origin: "Canada",
  yearsInHongKong: "4 years in Hong Kong",
  languages: ["English", "Cantonese", "Mandarin"],
};

export const featuredProjects = [
  {
    number: "01", slug: "hkmc-portfolio-automation", category: "Professional experience / financial data automation", title: "HKMC Portfolio Automation", summary: "Python workflows for multi-source portfolio review, reconciliation, risk analysis, and standardized reporting.", result: "≈ 2-minute test workflow", resultLabel: "reported workflow", technologies: ["Python", "pandas", "NumPy", "OpenPyXL"], kind: "pipeline",
    problem: "Financial risk review brings together portfolio, project, deal, cash-flow, and loan-position records that need to agree before reporting.", approach: "Multi-source ingestion, field mapping, rule-based calculations, validation, reconciliation, duplicate detection, and formatted report output.", contribution: "Built reusable Python workflows across portfolio reporting, IFS comparisons, cash-flow / loan-position matching, document automation, and AI-assisted PowerPoint QA.", evidence: "A standardized full-portfolio reporting workflow was tested at approximately two minutes and reconciled against manual results. Confidential records and internal outputs are not shown.",
  },
  {
    number: "02", slug: "vgrf-koa-prediction", category: "Final year project / multimodal machine learning", title: "Smartphone vGRF Estimation & KOA Screening", summary: "A multimodal research pipeline combining smartphone video, force-plate data, pose / gait features, and six deep-learning architectures.", result: "R² ≈ 0.96 · AUC ≈ 0.70", resultLabel: "reported results", technologies: ["PyTorch", "BlazePose", "Time series", "Deep learning"], kind: "multimodal",
    problem: "Estimate vertical ground-reaction force from accessible signals while investigating knee-osteoarthritis screening.", approach: "451 participants move through video and force-plate alignment, pose / gait feature extraction, model comparison, and validation.", contribution: "Built and evaluated the multimodal pipeline across vGRF estimation and KOA screening tasks.", evidence: "vGRF estimation R² ≈ 0.96 ± 0.01; KOA screening AUC ≈ 0.70. This is research evidence, not a clinically deployed system.",
  },
  {
    number: "03", slug: "medisim", category: "LLM & intelligent applications", title: "MediSim — LLM Medical Diagnosis Simulation", summary: "An interactive medical simulation workflow combining structured cases, patient personas, text / voice consultation, dynamic tests, and review records.", result: "Structured consultation workflow", resultLabel: "system scope", technologies: ["Python", "Ollama", "LLM APIs", "Workflow design"], kind: "llm",
    problem: "Create a structured environment for practicing clinical reasoning with conversational, test, diagnosis, and review steps.", approach: "Case setup, patient persona, text / voice consultation, dynamic tests, diagnosis validation, and record review are connected into one user-facing flow.", contribution: "Designed and integrated the workflow with local Ollama models and API-based LLMs.", evidence: "Demonstrates LLM integration and workflow design; it is a simulation and educational prototype, not a clinical tool.",
  },
  {
    number: "04", slug: "fall-detection-system", category: "Computer vision / temporal machine learning", title: "Video-Based Fall Detection & Real-Time Alerting", summary: "A computer-vision pipeline from video frames and pose extraction through temporal modelling to an alerting output.", result: "98.81% test accuracy", resultLabel: "reported result", technologies: ["MediaPipe", "1D CNN", "RNN / LSTM", "CNN-Transformer"], kind: "vision",
    problem: "Detect falls from video-derived human-pose sequences and provide a clear real-time visual alert.", approach: "Pose landmarks are converted into temporal features and compared across 1D CNN, RNN, LSTM, and CNN-Transformer models.", contribution: "Built the pose-to-alert workflow and compared temporal model families against a consistent evaluation setup.", evidence: "98.81% test accuracy. The result supports a prototype workflow rather than a deployed safety product.",
  },
];

export const projectLibrary = [
  {
    number: "01",
    slug: "vgrf-koa-prediction",
    title: "Smartphone-based vGRF Estimation & KOA Screening",
    tags: ["Machine Learning", "Computer Vision", "Multimodal"],
    metric: "R² ≈ 0.96",
    detail: "vGRF estimation · KOA AUC ≈ 0.70",
    tools: "451 participants · smartphone video · force-plate data",
    figure: "multimodal",
    summary: "An end-to-end research pipeline that combines smartphone video, force-plate data, pose / gait features, model comparison, vGRF estimation, and KOA screening.",
    contribution: "Built and evaluated the multimodal pipeline from video and force-plate alignment through feature extraction, deep-learning comparison, and final screening analysis.",
    highlights: ["451 participants", "R² ≈ 0.96 ± 0.01 for vGRF estimation", "KOA screening AUC ≈ 0.70"],
  },
  {
    number: "02",
    slug: "medisim",
    title: "MediSim — LLM Medical Diagnosis Simulation System",
    tags: ["LLM", "Interactive AI"],
    metric: "LLM workflow",
    detail: "medical diagnosis simulation",
    tools: "Ollama · APIs · text / voice · structured cases",
    figure: "llm",
    summary: "An LLM-powered virtual-patient simulation for practising consultation, test selection, diagnosis, and review in one guided workflow.",
    contribution: "Designed and integrated structured cases, patient personas, text / voice consultation, dynamic tests, diagnosis validation, and review records with local Ollama models and API-based LLMs.",
    highlights: ["Virtual-patient generation", "Consultation dialogue with text / voice support", "Diagnosis and review loop"],
  },
  {
    number: "03",
    slug: "fall-detection-system",
    title: "Video-based Fall Detection & Real-time Alerting",
    tags: ["Machine Learning", "Computer Vision"],
    metric: "98.81%",
    detail: "test accuracy",
    tools: "MediaPipe · pose sequences · temporal models",
    figure: "vision",
    summary: "A computer-vision and temporal-modelling pipeline that turns video into pose sequences, fall-state classification, and a real-time alert output.",
    contribution: "Built the pose-to-alert workflow and compared 1D CNN, RNN, LSTM, and CNN-Transformer model families in a consistent evaluation setup.",
    highlights: ["Video input → pose landmarks → temporal motion", "Temporal model comparison", "98.81% test accuracy"],
  },
  {
    number: "04",
    slug: "emopet",
    title: "EmoPet — EEG Emotion Recognition & Interactive AI Companion",
    tags: ["Machine Learning", "Biosignals", "LLM"],
    metric: "78.1%",
    detail: "accuracy · ROC-AUC 0.8314",
    tools: "EEG · STFT · wavelet denoising · CNN-GRU · CNN-LSTM",
    figure: "spectral",
    summary: "A biosignal-AI system that connects real-time EEG processing and emotion recognition to an interactive desktop companion.",
    contribution: "Connected filtering, STFT / wavelet-based preprocessing, CNN-GRU / CNN-LSTM sequence models, negative-emotion detection, desktop-pet responses, and optional local Ollama conversation.",
    highlights: ["EEG monitoring and emotion recognition", "78.1% accuracy · ROC-AUC 0.8314", "Local Ollama conversation support"],
  },
  {
    number: "05",
    slug: "parkincare",
    title: "ParkinCare — AI-based Parkinson’s Screening System",
    tags: ["Machine Learning", "Computer Vision", "Interactive AI"],
    metric: "95.83%",
    detail: "classification accuracy",
    tools: "CNN / ResNet · Unity · RFID · Arduino · HX711",
    figure: "integration",
    award: "Best Engineered Product Award",
    summary: "An integrated Parkinson’s screening prototype that combines interactive tasks, spiral-drawing classification, and connected hardware inputs.",
    contribution: "Integrated the user flow from RFID login through drawing, grip / reaction-time, and memory tasks to result handling, connecting Unity with RFID, Arduino, and HX711 components.",
    highlights: ["Spiral-drawing classification", "Grip strength, reaction time, and memory tasks", "95.83% classification accuracy"],
  },
  {
    number: "06",
    slug: "colon-gland-segmentation",
    title: "Colon Gland Segmentation — Histopathology Image Analysis",
    tags: ["Computer Vision", "Medical Imaging"],
    metric: ">0.90",
    detail: "AUC · Dice · pixel accuracy",
    tools: "U-Net · Attention U-Net · Swin U-Net · V-Net",
    figure: "segmentation",
    summary: "A medical-imaging segmentation study that compares U-Net-family architectures on colon-gland histopathology images.",
    contribution: "Worked through the segmentation pipeline from input images and masks to predicted masks and model evaluation.",
    highlights: ["Histopathology image segmentation", "Input image / ground-truth / predicted-mask comparison", "U-Net · Attention U-Net · Swin U-Net · V-Net"],
  },
  {
    number: "07",
    slug: "aiot-edge-cloud-scheduling",
    title: "Adaptive Edge–Cloud AI Scheduling for AIoT",
    tags: ["AI Systems", "Machine Learning"],
    metric: "AIoT",
    detail: "edge–cloud scheduling",
    tools: "incoming tasks · scheduler · edge / cloud decision",
    figure: "edge",
    summary: "A systems concept for coordinating AI workloads across edge and cloud environments through scheduling decisions.",
    contribution: "Defined the systems concept for routing incoming AI tasks through edge / cloud scheduling decisions.",
    highlights: ["Incoming task handling", "Scheduler decision", "Edge / cloud routing"],
  },
];

export const professionalExperience = [
  { period: "May 2026 — Aug 2026", role: "Risk Management Summer Intern", org: "The Hong Kong Mortgage Corporation Limited", featured: true, bullets: ["Automated legacy Excel/VBA, PDF and Word-based financial workflows in Python, covering portfolio reporting, cash-flow and loan-position reconciliation, and board-paper updates, with data validation, exception checks and standardized outputs.", "Built Python workflows to extract and reconcile financial records, analyse exposures and produce validated outputs for review.", "Developed standardized document workflows for board-paper updates, including template mapping and tracked-change review outputs.", "Architected a Codex Agent Skill for financial research and reporting, transforming research inputs into structured analysis and management-ready PowerPoint materials with workflow controls and quality checks."] },
];

export const hkmcWorkstreams = [
  { label: "A", title: "Portfolio / Excel reporting", detail: "standardized reports · monthly change tracking · Excel outputs", icon: "sheet" },
  { label: "B", title: "PDF cash-flow + loan positions", detail: "PDF extraction · matching · payment fields · exception filtering", icon: "pdf" },
  { label: "C", title: "Word report automation", detail: "content migration · section matching · compare / tracked-change output", icon: "word" },
  { label: "D", title: "Presentation automation", detail: "Codex-assisted edits · screenshot interpretation · slide QA", icon: "slides" },
  { label: "E", title: "Validation + reconciliation", detail: "duplicate detection · consistency checks · manual-result reconciliation", icon: "check" },
  { label: "F", title: "Risk research + analysis", detail: "counterparty · reinsurance · credit · ALM · GCC sovereign risk", icon: "chart" },
];

export const researchDataExperience = [
  { period: "Jun 2025 — Aug 2025", role: "Biomedical Data Analysis Intern", org: "Hong Kong Society for the Blind", tag: "fNIRS · scientific software", bullets: ["Supported fNIRS research on swallowing execution versus swallowing imagery through literature review, elderly-participant experiments, data collection, and preliminary analysis", "Built a Python GUI for single-file and batch processing of 780 / 850 nm channels, baseline selection, band-pass filtering, modified Beer–Lambert Law, and HbO / HbR / HbT calculation", "Produced Pearson-correlation connectivity matrices, heatmaps, and circular network visualisations across experimental conditions"] },
    { period: "Sep 2024 — Aug 2025", role: "AI Biomechanics Research Assistant", org: "The Hong Kong Polytechnic University", tag: "smartphone gait AI · imaging", bullets: ["Worked with 23 participants and 146 smartphone videos using BlazePose for ground-reaction-force estimation", "Compared six deep-learning architectures; CNN + LSTM achieved R² = 0.86 ± 0.08", "Supported knee-osteoarthritis X-ray classification through medical-image cleaning, preprocessing, and CNN experiments", "First-author WCSST 2025 research"] },
    { period: "May 2024 — Jul 2024", role: "Biomechanics Data Science / R&D Intern", org: "CLAIRE Clinical AI Research Limited", tag: "scientific computing", bullets: ["Worked across Vicon / C3D, OpenSim, .mot, force-plate, and EMG-related workflows", "Followed C3D → scaling → inverse kinematics → inverse dynamics → static optimisation / computed muscle control → joint-reaction analysis", "Troubleshot marker naming / displacement, abnormal scaling factors, force-plate output, negative inverse-dynamics, and joint-reaction discrepancies using Python and MATLAB"] },
];

export const otherExperience = [
  { period: "Jul 2024 — Aug 2024", role: "AI Medical Image Annotator", org: "The Hong Kong Polytechnic University", tag: "dataset quality", bullets: ["Identified target objects in 2D medical images and applied class annotations", "Organised datasets and checked for missing labels, incorrect labels, and annotation consistency", "Prepared higher-quality training data for downstream image-recognition work"] },
  { period: "Mar 2023 — Mar 2025", role: "Clinical Data Collection Assistant", org: "The Hong Kong Polytechnic University", tag: "clinical research", bullets: ["Supported scoliosis clinical research through participant data collection and protocol execution", "Maintained research records and databases with attention to data accuracy", "Worked with the team across a long-running clinical research workflow"] },
];

export const education = [
  { period: "Sep 2026 — Expected 2027", institution: "HKUST", degree: "MSc Artificial Intelligence", note: "Current / upcoming postgraduate education" },
  { period: "Aug 2022 — Jun 2026", institution: "The Hong Kong Polytechnic University", degree: "BSc Biomedical Engineering", note: "Secondary Major: Artificial Intelligence & Data Analytics · GPA 3.67 / 4.30" },
];

export const recognition = [
  { label: "First-author research", value: "WCSST 2025", detail: "Harnessing Smartphone Videos for Ground Reaction Force Estimation in Walking: A Deep Learning Approach · 23 participants · 146 smartphone videos · six architectures" },
  { label: "Brain science research", value: "Third Prize · English Group", detail: "5th Guangdong–Hong Kong–Macao Greater Bay Area Brain Science Forum / related academic salon, for fNIRS swallowing research" },
  { label: "Academic recognition", value: "Dean’s List", detail: "2023–2024 · 2024–2025" },
  { label: "Project recognition", value: "Best Engineered Product Award", detail: "ParkinCare" },
];

export const capabilities = [
  ["Data analysis", "pandas · NumPy · SciPy", "financial portfolio data", "scientific data · biosignals", "clinical data · multimodal datasets"],
  ["Data processing", "cleaning · preprocessing", "transformation · integration", "batch processing", "Python GUI workflows"],
  ["Data quality", "validation · reconciliation", "duplicate detection", "exception checking", "annotation QA · consistency checks"],
  ["Scientific analysis", "Pearson correlation", "PCA · signal filtering", "STFT · functional connectivity", "biomechanics pipelines"],
  ["Data automation", "OpenPyXL · Excel", "Word · PDF", "reporting workflows", "formatted output generation"],
  ["Machine learning", "PyTorch · scikit-learn", "CNN · RNN · LSTM · GRU", "Transformers", "model evaluation"],
];

export const beyondWork = { title: "Photography Content Creator", org: "Xiaohongshu", period: "May 2022 — Present", bullets: ["Independent photography and photo editing", "Content planning and account operation", "Approximately 3,550+ followers and 74,000+ likes / saves without paid promotion", "Iterative content improvement based on audience response"] };
