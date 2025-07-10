"use client";
import "./globals.css";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import FlipNumbers from "react-flip-numbers";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { components as selectComponents } from 'react-select';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import ScrollReveal from "@/components/ScrollReveal";
import StarBorder from "@/components/StarBorder";
import "@/components/StarBorder.css";
import SpotlightCard from "@/components/SpotlightCard";
import "@/components/SpotlightCard.css";
import Aurora from "@/components/Aurora";
import "@/components/Aurora.css";
import TiltedCard from "@/components/TiltedCard";
import "@/components/TiltedCard.css";
import { PARAM_GROUPS, UI_TEXT } from "@/constants/fields";
import TextareaAutosize from 'react-textarea-autosize';
import { Paperclip, Plus, Mic, Send, Sparkles, Copy, Download, RefreshCw, HelpCircle, Trophy, Check } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from 'next-themes';
import type { TooltipContentProps } from 'recharts';
import dynamic from 'next/dynamic';

// 通用芯片icon（heroicons/cpu）
const ChipIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block mr-2 text-blue-500">
    <rect x="7" y="7" width="10" height="10" rx="2" strokeWidth="1.5" />
    <rect x="11" y="11" width="2" height="2" rx="1" fill="currentColor" />
    <path strokeWidth="1.5" d="M4 9V7a3 3 0 0 1 3-3h2m6 0h2a3 3 0 0 1 3 3v2m0 6v2a3 3 0 0 1-3 3h-2m-6 0H7a3 3 0 0 1-3-3v-2" />
    <path strokeWidth="1.5" d="M9 4V2m6 2V2m0 20v-2m-6 2v-2M2 15h2m16 0h2M2 9h2m16 0h2" />
  </svg>
);

const precisionOptions = ["全部", "FP16", "FP32", "FP32", "INT8", "INT4"];
const chips = [
  {
    id: "default",
    name: "请选择芯片",
    tdp: "--",
    inferTdp: "--",
    memory: "--",
    bandwidth: "--",
    commBandwidth: "--",
    precision: ["FP16"],
    ecosystem: ["--"],
    icon: <ChipIcon />,
    desc: "请选择芯片，查看详细介绍。"
  },
  {
    id: "nvidia",
    name: "NVIDIA A100",
    tdp: "400",
    inferTdp: "250",
    memory: "40",
    bandwidth: "1555",
    commBandwidth: "600",
    precision: ["FP16", "FP32", "INT8"],
    ecosystem: ["ONNX", "TensorRT"],
    icon: <ChipIcon />,
    desc: "NVIDIA A100 适合大规模AI训练和推理，广泛应用于云计算、深度学习等场景。"
  },
  {
    id: "huawei",
    name: "华为 Ascend 910",
    tdp: "350",
    inferTdp: "220",
    memory: "32",
    bandwidth: "1200",
    commBandwidth: "400",
    precision: ["FP16", "FP32", "INT8"],
    ecosystem: ["MindSpore", "ONNX"],
    icon: <ChipIcon />,
    desc: "华为 Ascend 910 适合AI推理和训练，支持国产生态，适用于智能制造、自动驾驶等。"
  },
  {
    id: "other",
    name: "通用芯片",
    tdp: "75",
    inferTdp: "50",
    memory: "24",
    bandwidth: "800",
    commBandwidth: "200",
    precision: ["FP16", "INT4"],
    ecosystem: ["ONNX", "PyTorch"],
    icon: <ChipIcon />,
    desc: "通用芯片适合中小规模AI应用，性价比高，适用于边缘计算、轻量级推理等。"
  }
];

const models = [
  { id: "qwen", name: "Qwen", icon: <ChipIcon /> },
  { id: "openai", name: "OpenAI", icon: <ChipIcon /> },
  { id: "baichuan", name: "Baichuan", icon: <ChipIcon /> },
  { id: "deepseek", name: "DeepSeek", icon: <ChipIcon /> }
];

const searchModels = [
  { id: "qwen", name: "Qwen", icon: <ChipIcon /> },
  { id: "openai", name: "OpenAI", icon: <ChipIcon /> }
];

// 进度条（蓝色）
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-24 h-3 bg-gray-200 rounded overflow-hidden">
      <div className="bg-blue-400 h-3 rounded" style={{ width: `${percent}%` }} />
    </div>
  );
}

// 芯片选项增加 icon 字段，logo 路径需放 public 目录
const chipOptions = [
  { value: 'huawei_atlas_v300pro', label: '华为 Atlas V300Pro', icon: <ChipIcon />, link: '', vendor: '华为', desc: '适合AI推理和训练，支持国产生态，适用于智能制造、自动驾驶等。' },
  { value: 'tianzhou_x6000', label: '天舟X6000', icon: <ChipIcon />, link: '', vendor: '云天励飞', desc: '适合边缘计算与轻量级推理，性价比高，适用于多种行业场景。' },
  { value: 'nvidia_4090', label: 'Nvidia 4090', icon: <ChipIcon />, link: '', vendor: 'Nvidia', desc: '适合高性能AI推理和训练，广泛应用于科研、创意设计等场景。' },
  { value: 'nvidia_a100', label: 'Nvidia A100', icon: <ChipIcon />, link: '', vendor: 'Nvidia', desc: '适合大规模AI训练和推理，广泛应用于云计算、深度学习等场景。' },
  { value: 'huawei_910b', label: '华为昇腾910B', icon: <ChipIcon />, link: '', vendor: '华为', desc: '适合AI推理和训练，支持国产生态，适用于智能制造、自动驾驶等。' },
];
const chipPrecisionMap: Record<string, string[]> = {
  nvidia_a100: ['FP16', 'INT8', 'FP32'],
  nvidia_h100: ['FP16', 'INT8', 'FP32', 'FP8'],
  atlas_800: ['FP16', 'INT4'],
  tianzhou_x6000: ['FP16', 'INT4', 'FP32'],
};
const chipParams: Record<string, any> = {
  huawei_atlas_v300pro: {
    memory: 32,
    bandwidth: 900,
    comm: 200,
    precision: ['FP16', 'INT4'],
    eco: ['MindSpore', 'ONNX'],
    maxPower: 350,
    avgPower: 180,
    efficiency: 0.51, // 新增能效比
  },
  tianzhou_x6000: {
    memory: 24,
    bandwidth: 800,
    comm: 200,
    precision: ['FP16', 'INT4', 'FP32'],
    eco: ['ONNX', 'PyTorch'],
    maxPower: 75,
    avgPower: 50,
    efficiency: 0.67, // 新增能效比
  },
  nvidia_4090: {
    memory: 24,
    bandwidth: 1008,
    comm: 200,
    precision: ['FP16', 'FP32', 'INT8'],
    eco: ['ONNX', 'TensorRT'],
    maxPower: 450,
    avgPower: 350,
    efficiency: 0.78, // 新增能效比
  },
  nvidia_a100: {
    memory: 40,
    bandwidth: 1555,
    comm: 600,
    precision: ['FP16', 'INT8', 'FP32'],
    eco: ['ONNX', 'PyTorch'],
    maxPower: 400,
    avgPower: 250,
    efficiency: 0.63, // 新增能效比
  },
  huawei_910b: {
    memory: 32,
    bandwidth: 1200,
    comm: 400,
    precision: ['FP16', 'FP32', 'INT8'],
    eco: ['MindSpore', 'ONNX'],
    maxPower: 350,
    avgPower: 220,
    efficiency: 0.63, // 新增能效比
  },
};

// 新增模型列表，logo 加默认占位，补充 description
const modelOptionsSingle = [
  { value: 'qwen3-32b', label: 'Qwen3', size: '32B', description: '通用大模型，适合多场景推理', logo: '/qwen.jpeg' },
  { value: 'deepseek-r1-671b', label: 'deepseek-R1', size: '671B', description: '超大参数量，适合极致推理与生成', logo: '/deepseeklogo.png' },
  { value: 'qwen2.5-vl-32b', label: 'Qwen2.5-VL', size: '32B', multimodal: true, description: '多模态能力，支持图文理解与生成', logo: '/qwen.jpeg' },
];

// 量化版本选项
const quantOptions = [
  { value: 'fp16', label: 'FP16' },
  { value: 'FP32', label: 'FP32' },
  { value: 'int8', label: 'INT8' },
  { value: 'int4', label: 'INT4' },
];

// 默认 icon 组件
function DefaultModelIcon() {
  return (
    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-200 to-yellow-100 flex items-center justify-center text-base font-bold text-blue-500">M</div>
  );
}

// ModelLogo 支持无 src 时用默认 icon
function ModelLogo({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <DefaultModelIcon />;
  return (
    <img
      src={src}
      alt={alt}
      className="w-7 h-7 rounded-lg object-cover bg-gray-100"
      onError={e => {
        const target = e.target as HTMLImageElement;
        if (target.src.indexOf('/logo-default.svg') === -1) {
          target.src = '/logo-default.svg';
        }
      }}
      style={{ objectFit: 'cover' }}
    />
  );
}

// 芯片多选区自定义样式和icon，参考图片
const ChipOption = (props: any) => (
  <selectComponents.Option {...props}>
    <span className="flex items-center gap-2">
      <ChipIcon />
      <span>{props.data.label}</span>
    </span>
  </selectComponents.Option>
);
// ChipMultiValue 组件，cursor/github 风格 tag
const ChipMultiValue = (props: any) => (
  <selectComponents.MultiValue {...props}>
    <span className="flex items-center gap-1 px-3 py-1 bg-[#23272f] text-white rounded-full text-base font-medium shadow-none border-none cursor-pointer transition-colors duration-150 hover:bg-[#30343b]">
      <ChipIcon />
      {props.data.label}
    </span>
  </selectComponents.MultiValue>
);

// 雷达图参数字段，动态指标
const radarParams = PARAM_GROUPS;

// NeonCard 内容区恢复明暗自适应
function NeonCard({ children, className = "", style = {} }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`neon-card ${className} dark:bg-zinc-900`}
      style={{
        borderRadius: "2rem",
        border: "4px solid transparent",
        background:
          "linear-gradient(white, white) padding-box, conic-gradient(from 0deg at 50% 50%, #60a5fa 0%, #a78bfa 25%, #f472b6 50%, #60a5fa 100%) border-box",
        animation: "spin-slow 4s linear infinite",
        ...style,
      }}
    >
      {children}
      <style jsx>{`
        .neon-card {
          background-clip: padding-box, border-box;
        }
        @media (prefers-color-scheme: dark) {
          .neon-card {
            background:
              linear-gradient(#18181b, #18181b) padding-box,
              conic-gradient(from 0deg at 50% 50%, #60a5fa 0%, #a78bfa 25%, #f472b6 50%, #60a5fa 100%) border-box;
          }
        }
      `}</style>
    </div>
  );
}

// ChatBubble 组件，支持 user/assistant 两种气泡颜色和小尾巴
function ChatBubble({ role, children }: { role: 'user' | 'assistant', children: React.ReactNode }) {
  // 颜色与小尾巴方向
  const isUser = role === 'user';
  return (
    <div className={`relative flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`relative max-w-[90%] px-5 py-3 mb-1 rounded-2xl text-base shadow-sm
        ${isUser
          ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900'
          : 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white'}
        `}
        style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}
      >
        {children}
      </div>
    </div>
  );
}

// 1. 新增品牌 Logo 组件，便于卡片内复用
function BrandLogo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-7 w-7 rounded shadow-md bg-white/20 p-0.5 object-contain ${className}`}
      style={{ maxWidth: 32, maxHeight: 32 }}
    />
  );
}

// 贴纸图片数组，left 和 top 用百分比，自适应页面宽度
const stickers = [
  { src: "/code.png", alt: "Oval Sticker", style: { top: "8%", left: "7%", rotate: -12, size: 72, duration: 6, opacity: 0.28 } },
  { src: "/codex.png", alt: "Star Sticker", style: { top: "55%", left: "22%", rotate: 8, size: 90, duration: 7, opacity: 0.25 } },
  { src: "/Dev Mode.png", alt: "Terminal Sticker", style: { top: "20%", left: "48%", rotate: -6, size: 56, duration: 5, opacity: 0.32 } },
  { src: "/Dev Mode Switch.png", alt: "DevMode Sticker", style: { top: "70%", left: "70%", rotate: 14, size: 110, duration: 8, opacity: 0.22 } },
  { src: "/A_.png", alt: "A问号贴纸", style: { top: "80%", left: "35%", rotate: -18, size: 70, duration: 6.5, opacity: 0.26 } },
  { src: "/Community Icon.png", alt: "地球社区贴纸", style: { top: "40%", left: "90%", rotate: 10, size: 80, duration: 7.5, opacity: 0.24 } },
];

// 用dynamic动态导入SelectMulti，ssr: false
const SelectMulti = dynamic(() => import('react-select'), { ssr: false });

export default function ChipExperiencePage() {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  // 新增：模型单选、芯片多选，默认选中云天·天舟 X6000
  const [selectedModel, setSelectedModel] = useState<string>(modelOptionsSingle[0].value);
  const [selectedChips, setSelectedChips] = useState<string[]>(['tianzhou_x6000']);
  const [taskInput, setTaskInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  // 语义搜索
  const [searchInput, setSearchInput] = useState("");
  const [selectedSearchModel, setSelectedSearchModel] = useState("qwen");
  const [searchResult, setSearchResult] = useState<string>("");
  const [searchParams, setSearchParams] = useState<any>(null);
  // tab
  const [tab, setTab] = useState("llm");
  // 精度选择
  const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null);
  // 精度筛选
  const [filterPrecision, setFilterPrecision] = useState("全部");
  // 在 ChipExperiencePage 组件内，新增 messages 状态
  const [messages, setMessages] = useState([
    { role: 'assistant', type: 'text', content: '您好，有什么可以帮您？' }
  ]);
  // 1. 新增每个芯片的对话流状态
  const [chipMessages, setChipMessages] = useState<Record<string, {role: string, type: string, content: string, filename?: string, time?: number}[]>>({});
  // 新增：每个芯片的推理动态指标
  const [chipResultMetrics, setChipResultMetrics] = useState<Record<string, any[]>>({});
  // 在组件顶部 state 区域新增量化版本 state
  const [quantSelected, setQuantSelected] = useState('fp16');
  // 在组件顶部 state 区域新增大模型参数 state
  const [temperature, setTemperature] = useState(1);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(1);
  // 在 ChipExperiencePage 组件内 state 区域新增高级设置和并发数
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // 高级设置展开
  const [concurrency, setConcurrency] = useState(1); // 并发数，默认1
  const chatScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // 临时存储上传图片（未发送前）
  const [pendingImages, setPendingImages] = useState<{ url: string, file: File, filename: string }[]>([]);
  // 在组件顶部state区加：
  const [copiedIdx, setCopiedIdx] = useState<string|null>(null);
  // 在组件顶部定义selectRef
  const selectRef = useRef<any>(null);
  // useTheme 必须在顶层调用
  const { resolvedTheme } = useTheme();
  // 1. 底线颜色更深
  const radarGridColor = resolvedTheme === 'dark' ? '#23272f' : '#e5e7eb';
  const radarAxisColor = resolvedTheme === 'dark' ? '#222' : '#cbd5e1';
  // 在state区加深度思考loading
  const [thinking, setThinking] = useState(false);
  // 在state区加深度思考点击反馈
  const [thinkChecked, setThinkChecked] = useState(false);
  // 在state区加menuIsOpen
  const [chipMenuOpen, setChipMenuOpen] = useState(false);

  // 根据精度筛选芯片
  const filteredChips = filterPrecision === "全部"
    ? chips
    : chips.filter(c => c.precision.includes(filterPrecision) || c.id === "default");
  const chip = filteredChips.find((c) => c.id === selectedChip) || filteredChips[0];

  // react-select 需要的模型选项格式
  const modelOptions = models.map(m => ({ value: m.id, label: m.name, icon: m.icon }));
  // react-select 选中项格式
  const selectedModelOptions = modelOptions.filter(opt => selectedChips.includes(opt.value));

  // 多选模型逻辑（react-select专用）
  const handleModelMultiChange = (opts: any) => {
    if (!opts) return setSelectedChips([]);
    if (opts.length > 4) return; // 最多4个
    setSelectedChips(opts.map((o: any) => o.value));
  };

  // 2. 发送函数：所有选中芯片都追加一轮对话
  const handleSendToAll = () => {
    if ((!taskInput && pendingImages.length === 0) || !selectedModel || selectedChips.length === 0) return;
    // 组装多模态消息
    const newMsgs: { role: string; type: string; content: string; filename?: string }[] = [];
    if (taskInput) newMsgs.push({ role: 'user', type: 'text', content: taskInput });
    if (pendingImages.length > 0) {
      pendingImages.forEach(img => {
        newMsgs.push({ role: 'user', type: 'image', content: img.url, filename: img.filename });
      });
    }
    setChipMessages(prev => {
      const next = { ...prev };
      selectedChips.forEach(chipKey => {
        next[chipKey] = [
          ...(next[chipKey] || [{ role: 'assistant', type: 'text', content: '您好，有什么可以帮您？', time: Date.now() }]),
          ...newMsgs.map(m => ({ ...m, time: Date.now() }))
        ];
      });
      return next;
    });
    setTaskInput("");
    setPendingImages([]);
    setLoading(true);
    // 生成推理动态指标，支持多并发
    const metrics: Record<string, any[]> = {};
    selectedChips.forEach(chipKey => {
      metrics[chipKey] = Array.from({ length: concurrency }).map(() => {
        // 更真实的模拟数据
        const latency = Number((Math.random() * 2.5 + 0.5).toFixed(2)); // 0.5~3.0秒
        const throughput = Math.floor(Math.random() * 270 + 30); // 30~300 Token/s
        const gpu = Math.floor(Math.random() * 16 + 70); // 70~85%
      const energy = Number((Math.random() * 0.5 + 0.5).toFixed(2));
        const cost = Number((Math.random() * 0.006 + 0.006).toFixed(4)); // 0.0060~0.0120
        return { latency, throughput, gpu, energy, cost };
      });
    });
    setChipResultMetrics(metrics);
    setTimeout(() => {
      setChipMessages(prev => {
        const next = { ...prev };
        selectedChips.forEach(chipKey => {
          next[chipKey] = [
            ...(next[chipKey] || [{ role: 'assistant', type: 'text', content: '您好，有什么可以帮您？', time: Date.now() }]),
            { role: 'assistant', type: 'text', content: taskInput, time: Date.now() }
          ];
        });
        return next;
      });
      setLoading(false);
    }, 800);
  };

  // 语义搜索运行
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchResult(`【${chip?.name}】【${searchModels.find(m=>m.id===selectedSearchModel)?.name}】语义搜索结果：\n${searchInput ? searchInput.slice(0, 40) + (searchInput.length > 40 ? '...' : '') : '这里会展示搜索输出内容。'}`);
      setSearchParams({
        latency: Math.floor(Math.random() * 100 + 100),
        throughput: Math.floor(Math.random() * 3000 + 6000),
        gpu: Math.floor(Math.random() * 20 + 70)
      });
      setLoading(false);
    }, 900);
  };

  // 自动滚动到最新对话
  useEffect(() => {
    selectedChips.forEach(chipKey => {
      const el = chatScrollRefs.current[chipKey];
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }, [chipMessages, loading, selectedChips]);

  // 3. 上传图片处理
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const imgs = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      filename: file.name
    }));
    setPendingImages(prev => [...prev, ...imgs]);
    e.target.value = '';
  };

  // 4. 删除待发送图片
  const handleRemovePendingImage = (idx: number) => {
    setPendingImages(prev => prev.filter((_, i) => i !== idx));
  };

  // 自定义ValueContainer
  const CustomValueContainer = (props: any) => {
    const { children, selectProps } = props;
  return (
      <selectComponents.ValueContainer {...props}>
        {children}
        <button
          type="button"
          className="ml-1 flex items-center px-2 py-1 rounded-full bg-[#23272f] text-blue-400 hover:bg-blue-600 hover:text-white text-base font-bold transition"
          style={{ height: 28 }}
          tabIndex={-1}
          onClick={e => {
            e.preventDefault();
            if (selectProps.innerRef && selectProps.innerRef.current) {
              selectProps.innerRef.current.focus();
            }
          }}
          title="添加对比芯片"
        >＋</button>
      </selectComponents.ValueContainer>
    );
  };

  // 1. 结果卡片参数区去掉能耗字段
  const radarIndicators = [
    { key: 'latency', label: '推理速度', reverse: true, unit: 's' },
    { key: 'throughput', label: '每秒吞吐量', unit: 'Token/s' },
    { key: 'cost', label: '单位推理成本', reverse: true, unit: '¥' },
    { key: 'efficiency', label: '能效比(TFLOPS/W)', unit: 'TFLOPS/W（FP16）' },
    { key: 'ecoScore', label: '生态兼容性', unit: '' },
  ];
  // 计算归一化区间
  const radarMax = { latency: 3, throughput: 300, cost: 0.012, efficiency: 1, ecoScore: 1 };
  const radarMin = { latency: 0.5, throughput: 30, cost: 0.006, efficiency: 0, ecoScore: 0 };

  // 计算每个参数的最优值
  const bestValues = {
    latency: Math.min(...selectedChips.map(chipKey => chipResultMetrics[chipKey]?.[0]?.latency ?? Infinity)),
    throughput: Math.max(...selectedChips.map(chipKey => chipResultMetrics[chipKey]?.[0]?.throughput ?? -Infinity)),
    gpu: Math.min(...selectedChips.map(chipKey => chipResultMetrics[chipKey]?.[0]?.gpu ?? Infinity)), // 改为最小为优
    cost: Math.min(...selectedChips.map(chipKey => chipResultMetrics[chipKey]?.[0]?.cost ?? Infinity)),
  };

  // 判断是否多卡对比
  const isMultiChip = selectedChips.length > 1;

  // 在ChipExperiencePage组件内添加：
  useEffect(() => {
    if (!chipMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      setChipMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [chipMenuOpen]);

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-zinc-900">
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      <div className="fixed top-0 left-0 w-full h-64 pointer-events-none z-0 select-none">
        {stickers.map((s, i) => (
          <motion.img
            key={i}
            src={s.src}
            alt={s.alt}
            className="absolute object-contain"
            style={{
              top: s.style.top,
              left: s.style.left,
              height: s.style.size, // 只设置高度
              width: 'auto',        // 宽度自适应
              rotate: `${s.style.rotate}deg`,
              zIndex: 0,
              opacity: s.style.opacity,
              filter: 'brightness(0.65) grayscale(0.18)',
            }}
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: s.style.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* 总览标题（AI 算力竞技场，英文副标题，漂浮贴纸） */}
        <div className="w-full max-w-5xl mx-auto mb-10 mt-14 text-center flex flex-col items-center gap-4 relative">
          <h1 className="text-5xl md:text-6xl font-bold tracking-wide text-white mb-2 font-[PingFang SC,Helvetica Neue,Arial,sans-serif]">
              {UI_TEXT.mainTitle}
          </h1>
          <p className="text-lg font-semibold text-center text-white dark:text-zinc-100 leading-tight mb-0 pb-0">
              {UI_TEXT.mainSubtitle}
          </p>
          <p className="text-base text-center text-zinc-300 dark:text-zinc-400 leading-tight mt-0 -mt-2">
              {UI_TEXT.mainSubtitleEn}
          </p>
          {/* 品牌 Logo 横排装饰区 */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            <img src="/huawei.png" alt="Unicloud" className="h-8 rounded shadow-lg bg-white/10 p-1 transition-transform hover:scale-105" />
            <img src="/yuntianlogo.png" alt="IF" className="h-8 rounded shadow-lg bg-white/10 p-1 transition-transform hover:scale-105" />
            <img src="/nvidia-logo.png" alt="NVIDIA" className="h-8 rounded shadow-lg bg-white/10 p-1 transition-transform hover:scale-105" />
          </div>
        </div>
        <div className="flex flex-row w-full max-w-5xl mx-auto">
          {/* 左侧竖向流程线+步骤名 */}
          <div className="flex flex-col items-center mr-8 min-w-[90px] pt-2">
            {/* 步骤1：选择芯片 */}
            <div className="flex flex-col items-center mb-8">
              <div className={`w-4 h-4 rounded-full border-2 ${selectedChips.length > 0 ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'} mb-1`} />
                <span className={`text-xs font-semibold ${selectedChips.length > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{UI_TEXT.chipSelect}</span>
            </div>
            {/* 竖线 */}
            <div className="w-px flex-1 bg-gradient-to-b from-blue-100 to-gray-100" />
            {/* 步骤2：输入体验 */}
            <div className="flex flex-col items-center my-8">
              <div className={`w-4 h-4 rounded-full border-2 ${(selectedChips.length > 0 && taskInput) ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'} mb-1`} />
                <span className={`text-xs font-semibold ${(selectedChips.length > 0 && taskInput) ? 'text-blue-600' : 'text-gray-400'}`}>{UI_TEXT.inputExperience}</span>
            </div>
            <div className="w-px flex-1 bg-gradient-to-b from-blue-100 to-gray-100" />
            {/* 步骤3：查看结果 */}
            <div className="flex flex-col items-center mt-8">
              <div className={`w-4 h-4 rounded-full border-2 ${(selectedChips.length > 0 && Object.values(chipMessages).some(msgs => msgs.some(m => m.role === 'user'))) ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300'} mb-1`} />
                <span className={`text-xs font-semibold ${(selectedChips.length > 0 && Object.values(chipMessages).some(msgs => msgs.some(m => m.role === 'user'))) ? 'text-blue-600' : 'text-gray-400'}`}>{UI_TEXT.resultCompare}</span>
            </div>
          </div>
          {/* 右侧主内容区 */}
          <div className="flex-1 space-y-8 relative">
            {/* 芯片多选区，精简为仅下拉框+标题，外层用SpotlightCard分层美化，宽度与下方对齐 */}
            <div className="w-full max-w-5xl mx-auto mt-8">
              <div className="mb-2">
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1">{UI_TEXT.chipSelectTitle}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{UI_TEXT.chipSelectDesc}</p>
              </div>
              <SpotlightCard className="w-full bg-[#18181b] text-white rounded-2xl shadow-lg shadow-blue-900/30 border border-[#23272f] p-4" spotlightColor="rgba(0, 229, 255, 0.13)">
                <div className="w-full">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div
                          className="chip-select-toggle-wrap"
                          style={{ position: 'relative' }}
                          onClick={e => {
                            e.stopPropagation();
                            setChipMenuOpen(v => !v);
                          }}
                        >
                  <SelectMulti
                    isMulti
                    options={chipOptions}
                    value={chipOptions.filter(opt => selectedChips.includes(opt.value))}
                            onChange={(newValue: any, _action: any) => setSelectedChips(Array.isArray(newValue) ? newValue.map((o: any) => o.value) : [])}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    isClearable={false}
                    maxMenuHeight={220}
                            placeholder={UI_TEXT.chipSelectPlaceholder}
                    classNamePrefix="chip-select"
                            components={{ Option: ChipOption, MultiValue: ChipMultiValue, ValueContainer: CustomValueContainer }}
                            menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                            menuShouldBlockScroll={false}
                            menuIsOpen={chipMenuOpen}
                            onBlur={() => setChipMenuOpen(false)}
                            onMenuClose={() => setChipMenuOpen(false)}
                            ref={selectRef}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderRadius: 20,
                        minHeight: 48,
                        fontSize: 16,
                        background: state.isFocused ? '#18181b' : '#23272f',
                        border: state.isFocused ? '2px solid #60a5fa' : '2px solid #23272f',
                        boxShadow: state.isFocused ? '0 0 0 2px #60a5fa33' : '0 2px 12px 0 #0ea5e91a',
                        color: '#fff',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(6px)',
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: 18,
                        background: '#23272f',
                        color: '#fff',
                        border: '2px solid #23272f',
                        boxShadow: '0 8px 32px 0 #2563eb22',
                        marginTop: 8,
                        zIndex: 9999,
                        backdropFilter: 'blur(8px)',
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isSelected
                          ? 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)'
                          : state.isFocused
                          ? '#30343b'
                          : 'transparent',
                        color: state.isSelected ? '#fff' : state.isFocused ? '#60a5fa' : '#cbd5e1',
                        fontWeight: state.isSelected ? 700 : 500,
                        borderRadius: 12,
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                      }),
                      multiValue: (base) => ({
                        ...base,
                        background: '#23272f',
                        color: '#fff',
                        borderRadius: 9999,
                        padding: '2px 10px',
                        fontWeight: 600,
                        boxShadow: 'none',
                        margin: '2px 4px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#fff',
                        fontWeight: 600,
                        padding: 0,
                        fontSize: 15,
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#fff',
                        borderRadius: 9999,
                        marginLeft: 2,
                        ':hover': {
                          background: '#30343b',
                          color: '#60a5fa',
                        },
                      }),
                      valueContainer: (base) => ({ ...base, gap: 4, flexWrap: 'wrap' }),
                      singleValue: (base) => ({ ...base, color: '#fff' }),
                      input: (base) => ({ ...base, color: '#fff', background: 'transparent' }),
                      placeholder: (base) => ({ ...base, color: '#94a3b8', fontWeight: 400 }),
                      indicatorsContainer: (base) => ({ ...base, color: '#60a5fa' }),
                      dropdownIndicator: (base, state) => ({
                        ...base,
                        color: state.isFocused ? '#60a5fa' : '#94a3b8',
                        transition: 'color 0.2s',
                      }),
                      clearIndicator: (base) => ({
                        ...base,
                        color: '#fff',
                        ':hover': { color: '#60a5fa' },
                      }),
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                    }}
                            isOptionDisabled={(opts: any) => selectedChips.length >= 4 && !selectedChips.includes(opts.value)}
                  />
                        </div>
                      </div>
                    </div>
                </div>
              </SpotlightCard>
            </div>
            {/* 1. 芯片参数对比区（只展示参数） */}
            {selectedChips.length > 0 && (
              <div className="mb-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{UI_TEXT.chipCompare}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{UI_TEXT.chipCompareDesc}</p>
              </div>
            )}
            {selectedChips.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-10">
                {selectedChips.slice(0, 4).map((chipKey, idx) => {
                  const chip = chipOptions.find(c => c.value === chipKey);
                  const params = chipParams[chipKey];
                  if (!chip) return null;
            return (
                    <TiltedCard
                      key={chipKey}
                      imageSrc={chip.icon ? undefined : "/logo-default.svg"}
                      containerHeight="240px"
                      containerWidth="100%"
                      className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-8 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {chip.icon}
                        <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{chip.label}</span>
                        {chip.vendor && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 border border-blue-200 dark:border-blue-800 align-middle">{chip.vendor}</span>
                        )}
                      </div>
                      <div className="flex justify-between mb-2">
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">显存容量</span>
                          <span className="text-2xl font-extrabold text-blue-400 dark:text-blue-200">{params.memory}<span className="text-xs ml-1">GB</span></span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">显存带宽</span>
                          <span className="text-2xl font-extrabold text-blue-400 dark:text-blue-200">{params.bandwidth}<span className="text-xs ml-1">GB/s</span></span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">通信带宽</span>
                          <span className="text-2xl font-extrabold text-blue-400 dark:text-blue-200">{params.comm}<span className="text-xs ml-1">GB/s</span></span>
                        </div>
                      </div>
                      <div className="flex justify-between mb-3">
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">最大功耗</span>
                          <span className="text-lg font-bold text-blue-500 dark:text-blue-300">{params.maxPower}<span className="text-xs ml-1">W</span></span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">能效比（TFLOPS/W）</span>
                          <span className="text-lg font-bold text-blue-500 dark:text-blue-300">{params.efficiency}<span className="text-xs ml-1">TFLOPS/W</span></span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2 min-h-[28px]">{chip.desc}</div>
                      <div className="flex justify-end">
                        <a href={chip.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 dark:text-blue-300 hover:underline font-medium">了解更多</a>
                      </div>
                    </TiltedCard>
                  );
                })}
              </div>
            )}
            {/* 推理体验区块标题和文案 */}
            <div className="mb-2 mt-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{UI_TEXT.modelExperience}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">{UI_TEXT.modelExperienceDesc}</p>
            </div>
            {/* 输入区Card（重构：参数区+输入区分明，全部平铺，风格对标Claude/OpenAI） */}
            <SpotlightCard className="mb-10 w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl p-8 shadow-lg dark:shadow-blue-900/30 border border-gray-200 dark:border-zinc-800" spotlightColor="rgba(0, 229, 255, 0.13)">
              <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl p-0">
                {/* 参数区 */}
                <div className="param-section grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 px-8 pt-8">
                  {/* 模型选择 */}
                  <div className="flex items-center gap-3">
                    <span className="w-28 text-sm text-gray-500">{UI_TEXT.modelConfig}</span>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="h-10 min-w-[180px] rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-base font-medium focus:ring-2 focus:ring-blue-200 shadow-sm dark:shadow-none text-gray-900 dark:text-white">
                        {selectedModel ? (
                          <span className="flex items-center gap-3">
                            <ModelLogo src={modelOptionsSingle.find(m => m.value === selectedModel)?.logo} alt={modelOptionsSingle.find(m => m.value === selectedModel)?.label || ''} />
                            <span className="flex flex-col text-left">
                              <span className="font-semibold text-base leading-tight flex items-center gap-2">
                                {modelOptionsSingle.find(m => m.value === selectedModel)?.label}
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200">{modelOptionsSingle.find(m => m.value === selectedModel)?.size}</span>
                              </span>
                            </span>
                          </span>
                        ) : (
                          <SelectValue placeholder={UI_TEXT.modelSelectPlaceholder} />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {modelOptionsSingle.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <img src={opt.logo} alt={opt.label} className="h-6 max-w-[32px] object-contain" style={{ borderRadius: 4 }} />
                              <div>
                                <span>
                                  {opt.label}
                                  <span className="text-gray-400 ml-1">{opt.size}</span>
                                  {opt.multimodal && (
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-xs align-middle">多模态</span>
                                  )}
                                </span>
                                <div className="text-xs text-gray-400 mt-0.5">{opt.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* 量化选择 */}
                  <div className="flex items-center gap-3">
                    <span className="w-28 text-sm text-gray-500">{UI_TEXT.quantVersion}</span>
                    <div className="flex gap-2">
                      {quantOptions.map(opt => (
                        <button
                          key={opt.value}
                          className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${opt.value === quantSelected ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-400 dark:text-zinc-900 dark:border-blue-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-zinc-700 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'}`}
                          onClick={() => setQuantSelected(opt.value)}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* 在param-section后新增高级设置按钮和折叠区块： */}
                <div className="flex items-center gap-2 px-8 pb-2">
                  <button
                    className="text-xs text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition font-semibold"
                    onClick={() => setShowAdvancedSettings(v => !v)}
                  >
                    {showAdvancedSettings ? UI_TEXT.collapseAdvanced : UI_TEXT.expandAdvanced}
                  </button>
                </div>
                {showAdvancedSettings && (
                  <div className="param-section grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 px-8">
                      {/* Temperature */}
                    <div className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-500 flex items-center gap-1">
                        Temperature
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-blue-400"><HelpCircle size={16} strokeWidth={2.2} className="rounded-full bg-blue-50 dark:bg-zinc-800" /></span>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={4}>
                            控制生成内容的多样性，值越高输出越随机，常用范围0.7~1.2。
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <input type="range" min={0} max={2} step={0.01} value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="flex-1 accent-blue-500 max-w-[180px]" />
                        <span className="w-10 text-right text-xs text-gray-700 dark:text-gray-200 font-mono">{temperature.toFixed(2)}</span>
                      </div>
                      {/* Max tokens */}
                    <div className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-500">Max tokens</span>
                      <input type="range" min={128} max={32768} step={1} value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} className="flex-1 accent-blue-500 max-w-[180px]" />
                        <input type="number" min={128} max={32768} value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} className="w-16 text-xs text-gray-700 dark:text-gray-200 font-mono border border-gray-200 dark:border-zinc-700 rounded px-1 py-0.5 bg-white dark:bg-zinc-900" />
                      </div>
                      {/* Top P */}
                    <div className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-500 flex items-center gap-1">
                        Top P
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-pointer text-blue-400"><HelpCircle size={16} strokeWidth={2.2} className="rounded-full bg-blue-50 dark:bg-zinc-800" /></span>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={4}>
                            采样时保留概率前P的词汇，越小输出越确定，常用0.8~1。
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      <input type="range" min={0} max={1} step={0.01} value={topP} onChange={e => setTopP(Number(e.target.value))} className="flex-1 accent-blue-500 max-w-[180px]" />
                        <span className="w-10 text-right text-xs text-gray-700 dark:text-gray-200 font-mono">{topP.toFixed(2)}</span>
                      </div>
                    {/* 并发数 */}
                    <div className="flex items-center gap-3">
                      <span className="w-28 text-sm text-gray-500">{UI_TEXT.concurrency}</span>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={concurrency}
                        onChange={e => setConcurrency(Number(e.target.value))}
                        className="flex-1 accent-blue-500 max-w-[180px]"
                      />
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={concurrency}
                        onChange={e => setConcurrency(Number(e.target.value))}
                        className="w-12 text-xs text-gray-700 dark:text-gray-200 font-mono border border-gray-200 dark:border-zinc-700 rounded px-1 py-0.5 bg-white dark:bg-zinc-900"
                      />
                    </div>
                  </div>
                )}
                {/* 输入区 */}
                <div className="input-section flex flex-col gap-2 px-8 pb-8">
                  <div
                    className="flex flex-col gap-2 px-4 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-lg dark:shadow-blue-900/10 min-h-[80px] relative"
                    style={{ boxShadow: '0 4px 24px 0 rgba(60,120,255,0.06)' }}
                    onDrop={e => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files);
                      const imgs = files.filter(f => f.type.startsWith('image/')).map(file => ({ url: URL.createObjectURL(file), file, filename: file.name }));
                      if (imgs.length > 0) setPendingImages(prev => [...prev, ...imgs]);
                    }}
                    onDragOver={e => e.preventDefault()}
                  >
                    {/* tag+输入框混排区 */}
                    <div className="flex flex-wrap items-center gap-2 min-h-[40px]">
                      {pendingImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="tag flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-lg mr-1 mb-1 max-w-[160px] transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-blue-700 shadow-sm"
                        >
                          <img src={img.url} alt={img.filename} className="w-7 h-7 object-cover rounded" />
                          <span className="text-xs text-gray-700 dark:text-gray-200 truncate max-w-[80px]" title={img.filename}>{img.filename}</span>
                          <button
                            onClick={() => handleRemovePendingImage(idx)}
                            className="ml-1 text-gray-400 hover:text-red-500 text-base font-bold remove-btn"
                            title="移除"
                          >×</button>
                        </div>
                      ))}
                      <TextareaAutosize
                        minRows={1}
                        maxRows={8}
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                        placeholder={UI_TEXT.inputPlaceholder}
                        className="flex-1 min-h-[40px] bg-transparent border-none outline-none resize-none text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2 px-0"
                        style={{ minWidth: 120, paddingLeft: 0, paddingRight: 0 }}
                        onKeyDown={e => {
                          if (e.key === 'Backspace' && !taskInput && pendingImages.length > 0) {
                            handleRemovePendingImage(pendingImages.length - 1);
                            e.preventDefault();
                          }
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendToAll();
                          }
                        }}
                        onPaste={e => {
                          const items = e.clipboardData.items;
                          let pasted = false;
                          for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            if (item.kind === 'file') {
                              const file = item.getAsFile();
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setPendingImages(prev => [...prev, { url, file, filename: file.name }]);
                                pasted = true;
                              }
                            }
                          }
                          if (pasted) e.preventDefault();
                        }}
                    disabled={loading}
                  />
                    </div>
                    {/* 工具栏和发送按钮区（tag/扁平按钮风格） */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium cursor-pointer transition">
                          <Paperclip size={18} />
                          {UI_TEXT.uploadFile}
                          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageUpload} />
                        </label>
                    <button
                          type="button"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                            ${thinkChecked ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-800'}
                          `}
                          onClick={() => setThinkChecked(v => !v)}
                        >
                          <Sparkles size={18} />
                          {UI_TEXT.deepThink}
                        </button>
                      </div>
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-400 text-base font-semibold transition"
                      onClick={handleSendToAll}
                        disabled={loading || !selectedModel || (!taskInput && pendingImages.length === 0) || selectedChips.length === 0}
                        aria-label={UI_TEXT.send}
                        style={{ minWidth: 48 }}
                    >
                        <Send size={20} className="mr-1" />
                        {UI_TEXT.send}
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
            {/* 推理结果卡片（对话流风格），只在输入区Card之后渲染 */}
            {selectedChips.length > 0 && Object.values(chipMessages).some(msgs => msgs.some(m => m.role === 'user')) && (
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{UI_TEXT.resultCompare}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {concurrency > 1 ? UI_TEXT.resultCompareDesc(concurrency) : '算力硬件推理表现一览，助你选择最优方案'}
                  </p>
                </div>
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium transition z-10"
                  onClick={() => {
                    const data = { chipMessages, chipResultMetrics };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '推理对比结果.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  title="下载对比数据"
                >
                  <Download size={16} /> {UI_TEXT.downloadData}
                </button>
              </div>
            )}
            {selectedChips.length > 0 && Object.values(chipMessages).some(msgs => msgs.some(m => m.role === 'user')) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mb-10">
                {selectedChips.slice(0, 4).map(chipKey => {
                  const chip = chipOptions.find(c => c.value === chipKey);
                  const params = chipParams[chipKey];
                  const hasInput = (chipMessages[chipKey]||[]).some(m=>m.role==='user');
                  if (!hasInput) return null;
                  const arr = chipResultMetrics[chipKey];
                  const metricsArr: any[] = Array.isArray(arr) ? arr : [];
                  // 计算聚合统计
                  let avg = { latency: 0, throughput: 0, gpu: 0, energy: 0, cost: 0 };
                  if (metricsArr.length > 0) {
                    avg = {
                      latency: Math.round(metricsArr.reduce((a, b) => a + b.latency, 0) / metricsArr.length),
                      throughput: Math.round(metricsArr.reduce((a, b) => a + b.throughput, 0) / metricsArr.length),
                      gpu: Math.round(metricsArr.reduce((a, b) => a + b.gpu, 0) / metricsArr.length),
                      energy: Number((metricsArr.reduce((a, b) => a + b.energy, 0) / metricsArr.length).toFixed(2)),
                      cost: Number((metricsArr.reduce((a, b) => a + b.cost, 0) / metricsArr.length).toFixed(4)),
                    };
                  }
                  return (
                    <div key={chipKey} className="flex flex-col gap-4">
                      {/* 卡片背景整体包裹 */}
                      <div className="flex flex-col bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl shadow-xl p-8 min-h-[320px] max-h-[900px] gap-6 border border-gray-100 dark:border-zinc-800 overflow-y-auto relative">
                        {/* 对话流区 */}
                        <div
                          className="flex-1 overflow-y-auto flex flex-col gap-3 max-h-[300px]"
                          ref={el => { chatScrollRefs.current[chipKey] = el; }}
                          style={{ minHeight: 60 }}
                        >
                          {(chipMessages[chipKey] || []).map((msg, idx) => {
                            const isUser = msg.role === 'user';
                            return (
                              <div key={idx} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full max-w-[90%]`}>
                                  {/* 气泡上方名称栏 */}
                                  <div className={`mb-1 text-xs text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}
                                    style={{ lineHeight: 1.4 }}>
                                    【{chip?.label}】@{modelOptionsSingle.find(m => m.value === selectedModel)?.label}（{isUser ? UI_TEXT.user : UI_TEXT.assistant}）
                                    {msg.time && (
                                      <span className="ml-2 text-gray-300" title={msg.time ? new Date(msg.time).toLocaleString() : ''}>
                                        {msg.time ? new Date(msg.time).toLocaleTimeString() : ''}
                                      </span>
                                    )}
                                  </div>
                                  {/* 气泡本体 */}
                                  {msg.type === 'image' ? (
                                    <div
                                      className={
                                        `rounded-2xl shadow-md overflow-hidden flex items-center justify-center
                                        ${isUser ? 'bg-zinc-800 ml-auto' : 'bg-gray-100 mr-auto'}`
                                      }
                                      style={{ padding: 0, maxWidth: 180, maxHeight: 180 }}
                                    >
                                      <img
                                        src={msg.content}
                                        alt={msg.filename}
                                        className="object-cover w-full h-full"
                                        style={{ borderRadius: '1rem', maxWidth: 180, maxHeight: 180, display: 'block', cursor: 'pointer' }}
                                        onClick={() => window.open(msg.content, '_blank')}
                                      />
                                    </div>
                                  ) : (
                                    <div className={
                                      `relative px-5 py-3 rounded-2xl shadow-sm
                                      ${isUser
                                        ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 ml-auto'
                                        : 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-white mr-auto'
                                      } text-base` // 由原text-xs提升为text-base
                                    }
                                      style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxWidth: '100%' }}
                                    >
                                      <div>{msg.content}</div>
                                      {msg.role === 'assistant' && (
                                        <div className="flex gap-2 mt-2">
                                          <button
                                            className="flex items-center gap-1 text-xs py-0.5 px-1.5 text-gray-400 hover:text-gray-600 transition"
                                            onClick={() => {
                                              navigator.clipboard.writeText(msg.content);
                                              setCopiedIdx(`${chipKey}-${idx}`);
                                              setTimeout(() => setCopiedIdx(null), 1200);
                                            }}
                                          >
                                            <Copy size={13} />
                                            {copiedIdx === `${chipKey}-${idx}` ? UI_TEXT.copied : UI_TEXT.copy}
                                          </button>
                                          <button
                                            className="flex items-center gap-1 text-xs py-0.5 px-1.5 text-gray-400 hover:text-gray-600 transition"
                                            onClick={() => {/* 重新生成逻辑 */}}
                                          >
                                            <RefreshCw size={13} />
                                            {UI_TEXT.regenerate}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {loading && (
                            <div className="flex justify-start"><span className="inline-block px-4 py-2 rounded-xl bg-gray-100 animate-pulse text-base">{UI_TEXT.loading}</span></div>
                          )}
                        </div>
                        {/* 聚合性能指标区 */}
                        <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ChipIcon />
                        <span className="font-bold text-lg text-blue-700 dark:text-blue-300">{chip?.label}</span>
                            <span className="text-gray-400 text-base">
                              {concurrency > 1 ? UI_TEXT.avgCardTitle(concurrency) : '推理结果'}
                            </span>
                      </div>
                          <div className="border-t pt-3 pb-1">
                            <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                              {/* 推理时间 */}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">推理时间<span className="ml-1 text-xs text-gray-300">s</span></span>
                                <span className={`text-xl font-bold tabular-nums relative ${isMultiChip && avg.latency === bestValues.latency ? 'text-green-500' : 'text-blue-400 dark:text-blue-300'}`}>{avg.latency}{isMultiChip && avg.latency === bestValues.latency && <Trophy size={14} className="inline-block ml-1 text-amber-400 align-text-top" />}</span>
                      </div>
                              {/* 吞吐量 */}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">吞吐量<span className="ml-1 text-xs text-gray-300">Token/s</span></span>
                                <span className={`text-xl font-bold tabular-nums relative ${isMultiChip && avg.throughput === bestValues.throughput ? 'text-green-500' : 'text-blue-400 dark:text-blue-300'}`}>{avg.throughput}{isMultiChip && avg.throughput === bestValues.throughput && <Trophy size={14} className="inline-block ml-1 text-amber-400 align-text-top" />}</span>
                              </div>
                              {/* GPU占用 */}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">GPU占用<span className="ml-1 text-xs text-gray-300">%</span></span>
                                <span className={`text-xl font-bold tabular-nums relative ${isMultiChip && avg.gpu === bestValues.gpu ? 'text-green-500' : 'text-blue-400 dark:text-blue-300'}`}>{avg.gpu}{isMultiChip && avg.gpu === bestValues.gpu && <Trophy size={14} className="inline-block ml-1 text-amber-400 align-text-top" />}</span>
                              </div>
                              {/* 成本 */}
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-400">成本<span className="ml-1 text-xs text-gray-300">¥</span></span>
                                <span className={`text-xl font-bold tabular-nums relative ${isMultiChip && avg.cost === bestValues.cost ? 'text-green-500' : 'text-blue-400 dark:text-blue-300'}`}>{avg.cost}{isMultiChip && avg.cost === bestValues.cost && <Trophy size={14} className="inline-block ml-1 text-amber-400 align-text-top" />}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* 芯片参数对比雷达图 */}
            {selectedChips.length > 0 && Object.values(chipMessages).some(msgs => msgs.some(m => m.role === 'user')) && (
              <div className="w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-3xl shadow-xl p-8 mb-10 flex flex-col items-center border border-gray-100 dark:border-zinc-800">
                <div className="mb-2 w-full">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">{UI_TEXT.radarChartTitle}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{UI_TEXT.radarChartDesc}</p>
                </div>
                <ResponsiveContainer width="100%" height={360} minWidth={320}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={
                    radarIndicators.map(ind => {
                      const obj: any = { indicator: ind.label };
                    selectedChips.forEach(chipKey => {
                        let val = 0;
                        if (ind.key === 'efficiency') {
                          val = chipParams[chipKey]?.efficiency || 0;
                        } else if (ind.key === 'ecoScore') {
                          const ecoArr = chipParams[chipKey]?.eco || [];
                          val = Math.min(ecoArr.length / 4, 1); // 4为主流框架数
                        } else {
                          const arr = chipResultMetrics[chipKey];
                          const metricsArr: any[] = Array.isArray(arr) ? arr : [];
                          if (metricsArr.length > 0) {
                            val = metricsArr.reduce((a, b) => a + b[ind.key], 0) / metricsArr.length;
                          }
                        }
                        let norm = (val - radarMin[ind.key as keyof typeof radarMin]) / (radarMax[ind.key as keyof typeof radarMax] - radarMin[ind.key as keyof typeof radarMin]);
                        if (ind.reverse) norm = 1 - norm;
                        obj[chipOptions.find(c => c.value === chipKey)?.label || chipKey] = Math.max(0, Math.min(1, Number(norm.toFixed(2))));
                        // 原始值用于tooltip
                        obj[`${chipOptions.find(c => c.value === chipKey)?.label || chipKey}_raw`] = val;
                    });
                    return obj;
                    })
                  }>
                    <PolarGrid stroke={radarGridColor} />
                    <PolarAngleAxis dataKey="indicator" fontSize={14} stroke={radarAxisColor} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} stroke={radarAxisColor} />
                    {selectedChips.map((chipKey, idx) => {
                      const chip = chipOptions.find(c => c.value === chipKey);
                      return (
                        <Radar
                          key={chipKey}
                          name={chip?.label || chipKey}
                          dataKey={chip?.label || chipKey}
                          stroke={`hsl(${idx * 80}, 70%, 50%)`}
                          fill={`hsl(${idx * 80}, 70%, 60%)`}
                          fillOpacity={0.2}
                        />
                      );
                    })}
                    <Legend />
                    <RechartsTooltip
                      content={(props: TooltipContentProps<any, any>) => {
                        const { active, payload, label } = props;
                        if (!active || !payload) return null;
                        const values = payload.map((entry: any) => entry.value);
                        const max = Math.max(...values);
                        const min = Math.min(...values);
                        return (
                          <div className="p-2 bg-white dark:bg-zinc-900 rounded shadow text-xs">
                            <div className="font-bold mb-1">{String(label)}</div>
                            {payload.map((entry: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span style={{ color: entry.color, fontWeight: isMultiChip && (entry.value === max || entry.value === min) ? 700 : 400 }}>
                                  {entry.name}
                                </span>
                                <span className={isMultiChip && (entry.value === max || entry.value === min) ? 'text-green-500 font-bold' : ''}>{Math.round(entry.value * 100)}%</span>
                                <span className="text-gray-400 ml-1">({entry.payload[`${entry.name}_raw`]})</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
            {/* 1. 移除Tabs，仅保留主流程 */}
            {/* 2. 输入区上方：已选择芯片消息卡片 */}
            {selectedChips.length > 0 && (
              <div className="mb-4">
                <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300">
                  <span>{UI_TEXT.selectedChips}:</span>
                  {selectedChips.map(chipKey => {
                    const chip = chipOptions.find(c => c.value === chipKey);
                    return (
                      <span key={chipKey} className="flex items-center gap-1 px-2 py-1 bg-blue-100 border border-blue-200 rounded-xl text-blue-700 text-sm font-medium">
                        <ChipIcon />
                        {chip?.label}
                      </span>
            );
          })}
        </div>
      </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}

{/* cursor/github风格下拉框全局样式，只保留深色 */}
<style jsx global>{`
  .chip-select__control,
  .chip-select__menu,
  .chip-select__option,
  .chip-select__multi-value {
    transition: all 0.2s;
  }
  .chip-select__multi-value {
    border: none;
    box-shadow: none;
    font-size: 15px;
    background: #23272f !important;
    color: #fff !important;
    margin: 2px 4px;
    padding: 2px 10px;
    cursor: pointer;
  }
  .chip-select__multi-value__remove {
    border-radius: 9999px;
    margin-left: 2px;
    color: #fff !important;
    transition: background 0.15s;
  }
  .chip-select__multi-value__remove:hover {
    background: #30343b !important;
    color: #60a5fa !important;
  }
  .chip-select__option--is-focused {
    box-shadow: 0 0 0 2px #2563eb22;
  }
  .tag {
    transition: background 0.15s, box-shadow 0.15s;
    box-shadow: 0 1px 4px 0 rgba(60,120,255,0.04);
  }
  .tag:hover {
    background: #e0e7ef !important;
    box-shadow: 0 2px 8px 0 rgba(60, 120, 255, 0.08);
  }
  .tag .remove-btn {
    opacity: 0.6;
    transition: opacity 0.15s, color 0.15s;
  }
  .tag:hover .remove-btn {
    opacity: 1;
    color: #f87171 !important;
  }
  .input-section .react-textarea-autosize {
    font-size: 1.125rem;
    line-height: 1.7;
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    resize: none;
    color: inherit;
    width: 100%;
    min-width: 120px;
  }
`}</style>
