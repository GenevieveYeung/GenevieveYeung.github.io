import type { ProjectNarrative } from "@/data/project-narratives";

type Locale = "en" | "zh-CN" | "zh-HK";
type ProjectCaseStudy = Partial<ProjectNarrative>;

/** Portfolio-first overrides: explain the problem and outcome before the implementation details. */
export const projectCaseStudies: Record<Locale, Record<string, ProjectCaseStudy>> = {
  en: {
    "vgrf-koa-prediction": {
      title: "Smartphone-based vGRF Estimation & KOA Screening",
      subtitle: "Smartphone gait video → vGRF estimation → KOA screening",
      summary: "A lightweight biomechanical screening system that estimates vertical ground reaction force from smartphone gait video, then uses derived gait features to support KOA screening.",
      contribution: "Built and evaluated the workflow from smartphone video and force-plate alignment through pose estimation, vGRF modelling, feature extraction and KOA classification.",
      detail: "Smartphone gait video → vGRF estimation → KOA screening",
      methods: ["BlazePose", "deep-learning model comparison", "Random Forest", "smartphone video + force-plate data"],
      results: [{ value: "451 participants", label: "Paired smartphone video and force-plate dataset" }, { value: "R² ≈ 0.96 ± 0.01", label: "vGRF estimation" }, { value: "AUC ≈ 0.70", label: "KOA screening" }],
    },
    medisim: {
      title: "MediSim — LLM Medical Diagnosis Simulation System",
      subtitle: "A guided virtual-patient experience for practising clinical reasoning",
      summary: "A virtual-patient system that lets users practise consultation, test selection, diagnosis and review in one guided workflow.",
      contribution: "Designed the case structure and connected patient personas, text and voice consultation, dynamic tests, diagnosis validation and review records across local and API-based LLMs.",
      detail: "Virtual-patient diagnosis simulation",
      methods: ["LLM Applications", "Ollama", "text / voice interaction", "structured clinical cases"],
    },
    "fall-detection-system": {
      title: "Video-based Real-time Fall Detection",
      subtitle: "Real-time video monitoring · 98.81% test accuracy",
      summary: "A real-time fall-detection system that continuously monitors video, identifies fall events and triggers an immediate alert.",
      contribution: "Built the end-to-end real-time detection workflow, engineered pose-based temporal features, compared multiple sequence-model architectures and integrated the final classifier into a live alerting pipeline.",
      detail: "Fall-detection test accuracy",
      methods: ["MediaPipe Pose", "temporal feature extraction", "1D CNN / RNN / BiLSTM / CNN–Transformer"],
      results: [{ value: "98.81%", label: "Fall-detection test accuracy" }, { value: "Real-time", label: "Fall-state alert output" }],
    },
    emopet: {
      title: "EmoPet — EEG Emotion Recognition & Interactive AI Companion",
      subtitle: "Turning EEG signals into an interactive desktop companion",
      summary: "An interactive desktop companion that reads EEG signals, recognises emotional states and responds through a lightweight AI character.",
      contribution: "Connected signal filtering, STFT and wavelet preprocessing, CNN-GRU / CNN-LSTM models, negative-emotion detection, desktop-pet responses and optional local Ollama conversation.",
      detail: "EEG emotion-recognition accuracy",
      methods: ["EEG signal processing", "STFT / wavelet denoising", "CNN-GRU / CNN-LSTM", "Ollama"],
    },
    parkincare: {
      title: "ParkinCare — Gamified Parkinson’s Screening System",
      subtitle: "Gamified screening · AI + software + custom hardware",
      summary: "A gamified Parkinson’s screening system that lets users complete multiple motor and cognitive assessments through one interactive experience.",
      contribution: "Integrated the Unity-based game flow with AI image classification, RFID user identification and custom Arduino/HX711 sensing hardware. Implemented drawing, grip-strength, reaction-time and memory challenges within the same workflow.",
      detail: "Spiral-drawing classification accuracy",
      methods: ["AI: ResNet-based spiral classification", "Software: Unity", "Hardware: Arduino · HX711 · RFID", "Tasks: Drawing · Grip Strength · Reaction Time · Memory"],
      results: [{ value: "95.83%", label: "Spiral-drawing classification accuracy" }, { value: "Awarded", label: "Best Engineered Product Award" }],
    },
    "colon-gland-segmentation": {
      title: "Colon Gland Segmentation — Histopathology Image Analysis",
      subtitle: "Comparing segmentation models for medical-image analysis",
      summary: "A medical-imaging study that compares U-Net-family models on colon-gland histopathology images to make tissue boundaries easier to analyse.",
      contribution: "Built the evaluation workflow from input images and ground-truth masks through predicted masks, model comparison and segmentation metrics.",
      detail: "AUC · Dice · pixel accuracy",
      methods: ["U-Net", "Attention U-Net", "Swin U-Net", "V-Net"],
    },
    "aiot-edge-cloud-scheduling": {
      title: "Adaptive Edge–Cloud AI Scheduling for AIoT",
      subtitle: "Deploying AI effectively under real-world computing constraints",
      summary: "A resource-aware AIoT framework designed to make AI models practical on devices with limited computing resources.",
      contribution: "Designed an adaptive scheduling concept for deploying AI workloads across edge and cloud resources, focusing on how runtime constraints guide where each incoming task should run.",
      detail: "Edge–cloud scheduling logic",
      methods: ["AI Systems", "incoming AI workload", "scheduler decision", "edge execution / cloud offloading"],
    },
  },
  "zh-CN": {
    "vgrf-koa-prediction": { subtitle: "手机步态视频 → vGRF 估计 → KOA 筛查", summary: "一套轻量的生物力学筛查系统：先从手机步态视频估计垂直地面反作用力，再用步态特征辅助 KOA 筛查。", contribution: "搭建并评估从手机视频与测力台数据对齐、姿态估计、vGRF 建模，到特征提取和 KOA 分类的完整流程。", detail: "手机步态视频 → vGRF 估计 → KOA 筛查", methods: ["BlazePose", "深度学习模型比较", "Random Forest", "手机视频 + 测力台数据"], results: [{ value: "451 名参与者", label: "手机视频与测力台配对数据集" }, { value: "R² ≈ 0.96 ± 0.01", label: "vGRF 估计" }, { value: "AUC ≈ 0.70", label: "KOA 筛查" }] },
    medisim: { subtitle: "用虚拟患者练习临床推理", summary: "一个引导式虚拟患者系统，把问诊、检查选择、诊断和复盘放进同一套流程。", contribution: "设计病例结构，并把患者角色、文字与语音问诊、动态检查、诊断验证和复盘记录连接到本地及 API 型 LLM。", detail: "虚拟患者诊断模拟", methods: ["LLM 应用", "Ollama", "文字 / 语音互动", "结构化病例"] },
    "fall-detection-system": { subtitle: "实时视频监测 · 98.81% 测试准确率", summary: "一个持续监测视频的实时跌倒检测系统：识别跌倒事件，并立即触发提醒。", contribution: "搭建端到端实时检测流程，设计基于姿态的时序特征，比较多种序列模型，并将最终分类器接入实时提醒流程。", detail: "跌倒检测测试准确率", methods: ["MediaPipe Pose", "时序特征提取", "1D CNN / RNN / BiLSTM / CNN–Transformer"], results: [{ value: "98.81%", label: "跌倒检测测试准确率" }, { value: "实时", label: "跌倒状态提醒" }] },
    emopet: { subtitle: "把 EEG 信号变成会互动的桌面伙伴", summary: "一个互动桌面伙伴：读取 EEG 信号、识别情绪状态，再通过轻量的 AI 角色作出回应。", contribution: "连接信号滤波、STFT 与小波预处理、CNN-GRU / CNN-LSTM 模型、负面情绪识别、桌面宠物反馈及本地 Ollama 对话。", detail: "EEG 情绪识别准确率", methods: ["EEG 信号处理", "STFT / 小波去噪", "CNN-GRU / CNN-LSTM", "Ollama"] },
    parkincare: { subtitle: "游戏化筛查 · AI + 软件 + 定制硬件", summary: "一个游戏化帕金森筛查系统，让用户在一次互动体验中完成多项运动和认知评估。", contribution: "把 Unity 游戏流程与 AI 图像分类、RFID 用户识别及 Arduino/HX711 定制传感硬件连接起来，并在同一流程中实现绘图、握力、反应时间和记忆任务。", detail: "螺旋绘图分类准确率", methods: ["AI：基于 ResNet 的螺旋图像分类", "软件：Unity", "硬件：Arduino · HX711 · RFID", "任务：绘图 · 握力 · 反应时间 · 记忆"], results: [{ value: "95.83%", label: "螺旋绘图分类准确率" }, { value: "获奖", label: "最佳工程产品奖" }] },
    "colon-gland-segmentation": { subtitle: "比较医学图像分割模型", summary: "一项医学图像研究：比较 U-Net 系列模型在结肠腺体组织病理图像上的表现，让组织边界更容易分析。", contribution: "完成从输入图像、真实掩膜到预测掩膜、模型比较和分割指标评估的流程。", detail: "AUC · Dice · 像素准确率", methods: ["U-Net", "Attention U-Net", "Swin U-Net", "V-Net"] },
    "aiot-edge-cloud-scheduling": { subtitle: "在真实计算限制下部署 AI", summary: "一个面向资源有限设备的 AIoT 调度框架，让 AI 模型更容易在现实计算条件下运行。", contribution: "设计跨边缘与云端部署 AI 工作负载的自适应调度方案，思考如何根据运行限制决定每项任务应该在哪里执行。", detail: "边缘—云端调度逻辑", methods: ["AI 系统", "AI 工作负载", "调度决策", "边缘执行 / 云端卸载"] },
  },
  "zh-HK": {
    "vgrf-koa-prediction": { subtitle: "手機步態影片 → vGRF 估計 → KOA 篩查", summary: "一套輕量的生物力學篩查系統：先從手機步態影片估計垂直地面反作用力，再利用步態特徵協助 KOA 篩查。", contribution: "建立及評估由手機影片與測力台數據對齊、姿態估計、vGRF 建模，到特徵提取及 KOA 分類的完整流程。", detail: "手機步態影片 → vGRF 估計 → KOA 篩查", methods: ["BlazePose", "深度學習模型比較", "Random Forest", "手機影片 + 測力台數據"], results: [{ value: "451 名參與者", label: "手機影片與測力台配對數據集" }, { value: "R² ≈ 0.96 ± 0.01", label: "vGRF 估計" }, { value: "AUC ≈ 0.70", label: "KOA 篩查" }] },
    medisim: { subtitle: "以虛擬病人練習臨床推理", summary: "一個引導式虛擬病人系統，把問診、檢查選擇、診斷和覆核放進同一套流程。", contribution: "設計病例結構，並把病人角色、文字及語音問診、動態檢查、診斷驗證和覆核記錄連接到本地及 API 型 LLM。", detail: "虛擬病人診斷模擬", methods: ["LLM 應用", "Ollama", "文字 / 語音互動", "結構化病例"] },
    "fall-detection-system": { subtitle: "即時影片監測 · 98.81% 測試準確率", summary: "一個持續監測影片的即時跌倒檢測系統：識別跌倒事件，並即時觸發提示。", contribution: "建立端到端即時檢測流程，設計基於姿態的時序特徵，比較多種序列模型，並將最終分類器接入即時提示流程。", detail: "跌倒檢測測試準確率", methods: ["MediaPipe Pose", "時序特徵提取", "1D CNN / RNN / BiLSTM / CNN–Transformer"], results: [{ value: "98.81%", label: "跌倒檢測測試準確率" }, { value: "即時", label: "跌倒狀態提示" }] },
    emopet: { subtitle: "把 EEG 訊號變成可以互動的桌面夥伴", summary: "一個互動桌面夥伴：讀取 EEG 訊號、識別情緒狀態，再透過輕量的 AI 角色作出回應。", contribution: "連接訊號濾波、STFT 及小波預處理、CNN-GRU / CNN-LSTM 模型、負面情緒識別、桌面寵物回饋及本地 Ollama 對話。", detail: "EEG 情緒識別準確率", methods: ["EEG 訊號處理", "STFT / 小波去噪", "CNN-GRU / CNN-LSTM", "Ollama"] },
    parkincare: { subtitle: "遊戲化篩查 · AI + 軟件 + 定制硬件", summary: "一個遊戲化柏金遜症篩查系統，讓用戶在一次互動體驗中完成多項運動及認知評估。", contribution: "把 Unity 遊戲流程與 AI 影像分類、RFID 用戶識別及 Arduino/HX711 定制傳感器硬件連接起來，並在同一流程中實現繪圖、握力、反應時間和記憶任務。", detail: "螺旋繪圖分類準確率", methods: ["AI：基於 ResNet 的螺旋影像分類", "軟件：Unity", "硬件：Arduino · HX711 · RFID", "任務：繪圖 · 握力 · 反應時間 · 記憶"], results: [{ value: "95.83%", label: "螺旋繪圖分類準確率" }, { value: "獲獎", label: "最佳工程產品獎" }] },
    "colon-gland-segmentation": { subtitle: "比較醫學影像分割模型", summary: "一項醫學影像研究：比較 U-Net 系列模型在結腸腺體組織病理影像上的表現，讓組織邊界更容易分析。", contribution: "完成由輸入影像、真實遮罩到預測遮罩、模型比較和分割指標評估的流程。", detail: "AUC · Dice · 像素準確率", methods: ["U-Net", "Attention U-Net", "Swin U-Net", "V-Net"] },
    "aiot-edge-cloud-scheduling": { subtitle: "在真實運算限制下部署 AI", summary: "一個面向資源有限設備的 AIoT 調度框架，讓 AI 模型更容易在現實運算條件下運行。", contribution: "設計跨邊緣與雲端部署 AI 工作負載的自適應調度方案，思考如何根據運行限制決定每項任務應在哪裡執行。", detail: "邊緣—雲端調度邏輯", methods: ["AI 系統", "AI 工作負載", "調度決策", "邊緣執行 / 雲端卸載"] },
  },
};
