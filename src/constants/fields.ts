export const PARAM_GROUPS = [
  {
    groupKey: 'performance',
    groupLabel: '性能指标',
    params: [
      { key: 'latency', label: '推理时间(s)', avgLabel: '平均推理时间(s)' },
      { key: 'throughput', label: '每秒tokens', avgLabel: '平均每秒tokens' },
      { key: 'gpu', label: 'GPU占用(%)', avgLabel: '平均GPU占用(%)' },
    ]
  },
  {
    groupKey: 'cost',
    groupLabel: '成本',
    params: [
      { key: 'cost', label: '预估成本(¥)', avgLabel: '平均预估成本(¥)' },
    ]
  }
];

export const UI_TEXT = {
  mainTitle: '大模型推理演示平台',
  mainSubtitle: '主流大模型推理能力对比平台 - 帮你选出最适合的生产力',
  mainSubtitleEn: 'LLM Inference Demo Platform · Explore and Compare the Power of Mainstream Models & Chips',
  selectChip: '选择推理硬件（1/2）',
  selectChipDesc: '探索主流AI硬件，开启高效推理体验，支持4款硬件同时对比',
  modelExperience: '大模型推理体验（2/2）',
  modelExperienceDesc: '调试大模型及其参数，输入你的问题，体验推理实力',
  resultCompare: '推理结果展示',
  resultCompareDesc: (concurrency: number) =>
    concurrency > 1
      ? `多并发（${concurrency}）推理表现一览，助你选择最优方案`
      : '大模型推理表现一览，助你选择最优方案',
  radarTitle: '多维推理能力雷达图',
  radarDesc: '多维度直观对比，洞察模型推理潜力',
  radarSubtitle: '大模型推理结果对比雷达图',
  modelConfig: '大模型型号',
  quantVersion: '量化版本',
  advancedSettings: '高级设置',
  expandAdvanced: '展开高级设置',
  collapseAdvanced: '收起高级设置',
  concurrency: '模拟并发数',
  defaultCardTitle: '推理结果',
  avgCardTitle: (n: number) => `多并发（${n}）平均推理结果`,
  inputPlaceholder: '请输入你的问题...',
  send: '立即体验',
  loading: '助手正在思考...',
  selectedChips: '已选择芯片',
  // 新增补充字段
  chipSelect: '选择芯片',
  inputExperience: '输入体验',
  chipSelectTitle: '选择你的推理硬件（1/2）',
  chipSelectDesc: '探索主流AI推理硬件，开启高效推理体验，最多可同时对比4个',
  chipSelectPlaceholder: '请选择推理硬件...',
  modelSelectPlaceholder: '请选择模型',
  memory: '显存',
  bandwidth: '带宽',
  commBandwidth: '通信',
  maxPower: '最大功耗',
  avgPower: '推理均功耗',
  uploadFile: '上传文件',
  deepThink: '深度思考',
  downloadData: '下载数据',
  user: '用户',
  assistant: '助手',
  copy: '复制',
  copied: '已复制',
  regenerate: '重新生成',
  radarChartTitle: '多维推理能力雷达图',
  radarChartDesc: '多维度直观对比，洞察各模型推理潜力',
  radarChartSubtitle: '大模型推理结果对比雷达图',
}; 