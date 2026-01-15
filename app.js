/* -*- coding: utf-8 -*- */
/* G-LENS Integrated Platform — Student Registration · Evaluation · Reporting · Dashboard · Goal Library */

const { useState, useEffect, useMemo, useRef } = React;

const TAB_KEYS = {
  students: "students",
  evaluation: "evaluation",
  report: "report",
  dashboard: "dashboard",
  goals: "goals"
};

const LOCAL_STORAGE_KEYS = {
  students: "glens-students",
  evaluations: "glens-evaluations"
};

const DEFAULT_STUDENTS = [
  {
    id: "stu-001",
    name: "김민준",
    birth: "2016-08-15",
    grade: "초1",
    guardian: "김지연",
    contact: "010-1111-2222",
    notes: "감각추구 행동 관찰 중"
  },
  {
    id: "stu-002",
    name: "박서연",
    birth: "2015-05-22",
    grade: "초2",
    guardian: "박수진",
    contact: "010-3333-4444",
    notes: "공동주의 행동 증가 추세"
  },
  {
    id: "stu-003",
    name: "이도윤",
    birth: "2014-11-02",
    grade: "초3",
    guardian: "이영호",
    contact: "010-5555-6666",
    notes: "독립적인 놀이시간 확장 필요"
  }
];

const DEFAULT_EVALUATIONS = {
  "stu-001": {
    "2025-08": {
      responses: {
        item_1: 3,
        item_2: 2,
        item_3: 3,
        item_6: 2,
        item_7: 2,
        item_8: 3,
        item_11: 2,
        item_12: 2
      },
      levels: {
        item_1: "L3",
        item_2: "L2",
        item_3: "L3",
        item_6: "L2",
        item_7: "L2",
        item_8: "L3",
        item_11: "L2",
        item_12: "L2"
      },
      savedAt: "2025-08-25T10:15:00+09:00"
    },
    "2025-09": {
      responses: {
        item_1: 4,
        item_2: 3,
        item_3: 4,
        item_4: 3,
        item_6: 3,
        item_7: 4,
        item_8: 4,
        item_9: 3,
        item_10: 3,
        item_11: 3,
        item_12: 4,
        item_18: 3,
        item_25: 4
      },
      levels: {
        item_1: "L4",
        item_2: "L3",
        item_3: "L4",
        item_4: "L3",
        item_6: "L3",
        item_7: "L4",
        item_8: "L4",
        item_9: "L3",
        item_10: "L3",
        item_11: "L3",
        item_12: "L4",
        item_18: "L3",
        item_25: "L4"
      },
      savedAt: "2025-09-20T09:12:00+09:00"
    }
  },
  "stu-002": {
    "2025-09": {
      responses: {
        item_1: 4,
        item_2: 4,
        item_5: 4,
        item_13: 3,
        item_14: 3,
        item_19: 2,
        item_26: 3,
        item_31: 3,
        item_32: 3
      },
      levels: {
        item_1: "L4",
        item_2: "L4",
        item_5: "L4",
        item_13: "L3",
        item_14: "L3",
        item_19: "L2",
        item_26: "L3",
        item_31: "L3",
        item_32: "L3"
      },
      savedAt: "2025-09-18T14:05:00+09:00"
    }
  },
  "stu-003": {
    "2025-07": {
      responses: {
        item_3: 2,
        item_4: 2,
        item_5: 3,
        item_15: 2,
        item_16: 2,
        item_20: 1,
        item_34: 2,
        item_35: 2
      },
      levels: {
        item_3: "L2",
        item_4: "L2",
        item_5: "L3",
        item_15: "L2",
        item_16: "L2",
        item_20: "L1",
        item_34: "L2",
        item_35: "L2"
      },
      savedAt: "2025-07-22T11:45:00+09:00"
    },
    "2025-09": {
      responses: {
        item_3: 3,
        item_4: 3,
        item_5: 4,
        item_15: 3,
        item_16: 3,
        item_20: 2,
        item_34: 3,
        item_35: 3,
        item_36: 3,
        item_37: 2
      },
      levels: {
        item_3: "L3",
        item_4: "L3",
        item_5: "L4",
        item_15: "L3",
        item_16: "L3",
        item_20: "L2",
        item_34: "L3",
        item_35: "L3",
        item_36: "L3",
        item_37: "L2"
      },
      savedAt: "2025-09-19T16:20:00+09:00"
    }
  }
};

const BENCHMARK_INSIGHTS = [
  {
    title: "ABA·PBIS 행동 데이터 실시간 트래킹",
    description: "ABC 데이터, 빈도·지속시간, 강화 스케줄을 한 화면에서 캡처하고 교실·가정 환경을 분리 분석합니다.",
    tags: ["실시간 이벤트", "강화 스케줄", "행동 함수 분석"],
    focus: ["일일 패턴 감지", "강화 이력 타임라인", "자동 위험 신호"]
  },
  {
    title: "VB-MAPP·EFL 기반 목표 매핑",
    description: "표준 평가 문항과 IEP 목표를 자동 연결해 목표-기술-활동 추천 흐름을 구성합니다.",
    tags: ["표준 연계", "목표 추천", "난이도 스캐폴딩"],
    focus: ["목표-활동 매핑", "유사 목표 검색", "기준별 진행률"]
  },
  {
    title: "TEACCH 시각 지원 설계",
    description: "시각 일정표, 작업 시스템, 구조화된 환경 요소를 빠르게 구성하도록 템플릿을 제공합니다.",
    tags: ["시각 일정", "환경 구조화", "자립성 강화"],
    focus: ["일과 구성 자동화", "교실 레이아웃 힌트", "선호 자극 카드"]
  },
  {
    title: "AI 코스웨어 + 수업 흐름 추천",
    description: "AI 기반 미션/퀘스트형 수업 스크립트와 맞춤 과제를 자동 생성합니다.",
    tags: ["AI 수업 설계", "미션 기반", "적응형 과제"],
    focus: ["세션 목표 요약", "진행 중 피드백", "형성 평가 카드"]
  },
  {
    title: "다중 이해관계자 포털",
    description: "교사, 치료사, 보호자가 동일한 리포트를 공유하고 코멘트를 남기는 협업 허브를 구성합니다.",
    tags: ["협업", "알림", "접근 권한"],
    focus: ["상호 피드백", "보호자 요약 리포트", "승인 워크플로"]
  },
  {
    title: "데이터 시각화 & 성장 예측",
    description: "성장 곡선, 위험 추적, 개입 효과 분석을 대시보드에 통합합니다.",
    tags: ["성장 예측", "효과 분석", "경보 신호"],
    focus: ["성과 KPI", "개입 전후 비교", "리스크 레이더"]
  }
];

const DEFAULT_STUDENT_GOALS = {
  "stu-001": {
    active: [
      {
        code: "L-개인관리건강-1-04",
        summary: "손 씻기 루틴을 5회 중 4회 이상 독립 수행하도록 유지·일반화 전략을 실행한다.",
        detail: "수업 전략: 손 씻기 시각순서도 활용, 프롬프트 페이딩, 성공 시 강화 제공.",
        reinforcement: "독립 수행 3회 달성 시 구체적 칭찬과 선호 강화물 제공.",
        curriculum: "LifeSkills",
        area: "개인관리·건강"
      },
      {
        code: "C-교육과정-1204",
        summary: "[9보건01-03] 질병의 종류와 증상을 알고 예방 수칙을 실천한다.",
        detail: "",
        reinforcement: "",
        curriculum: "교육과정",
        area: "보건"
      }
    ],
    completed: [],
    hold: []
  },
  "stu-002": {
    active: [
      {
        code: "L-사회적관계-14-03",
        summary: "또래와 차례 지키기 활동에서 3분 이상 규칙을 유지한다.",
        detail: "수업 전략: 또래 짝 활동 구성, 타이머 활용, 행동 리허설.",
        reinforcement: "성공 시 사회적 강화(칭찬, 또래 점수) 제공.",
        curriculum: "LifeSkills",
        area: "사회적 관계"
      }
    ],
    completed: [],
    hold: []
  }
};

const REL_THRESHOLD_DEFAULT = 0.10;
const REL_FLOOR = 0.35;
const REL_ORDER = ["PBIS", "교육과정", "VB-MAPP", "EFL"];
const REL_QUOTAS = {
  PBIS: { min: 1, max: 3 },
  "교육과정": { min: 1, max: 8 },
  "VB-MAPP": { min: 1, max: 4 },
  EFL: { min: 1, max: 5 }
};
const MAX_RELATED_ITEMS = 10;

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed;
  } catch (error) {
    console.warn(`localStorage load 실패 (${key})`, error);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`localStorage 저장 실패 (${key})`, error);
  }
}

const COLOR_PALETTE = [
  "#2563eb",
  "#f97316",
  "#16a34a",
  "#facc15",
  "#ec4899",
  "#0ea5e9",
  "#8b5cf6",
  "#ef4444"
];

const fmtSim = (value) => (typeof value === "number" ? value.toFixed(3) : value);

function simBadge(sim) {
  if (sim >= 0.80) return "🟩";
  if (sim >= 0.70) return "🟨";
  if (sim >= 0.60) return "🟦";
  if (sim >= 0.50) return "⬜";
  return "▫️";
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function hexToRgba(hex, alpha = 1) {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getColor(index, alpha = 1) {
  const base = COLOR_PALETTE[index % COLOR_PALETTE.length];
  if (alpha === 1) return base;
  return hexToRgba(base, alpha);
}

function normalizeSimilarity(raw) {
  if (typeof raw === "number") return raw;
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeRelatedEntry(entry) {
  return {
    domain: entry.domain || "기타",
    text: entry.text || "",
    similarity: normalizeSimilarity(entry.similarity),
    matched_terms: Array.isArray(entry.matched_terms) ? entry.matched_terms : []
  };
}

function sampleRelatedItems(baseRelated, threshold) {
  if (!Array.isArray(baseRelated) || !baseRelated.length) return [];
  const normalized = baseRelated
    .map(normalizeRelatedEntry)
    .filter(item => item.similarity >= threshold);
  if (!normalized.length) return [];

  const grouped = {};
  normalized.forEach(item => {
    if (!grouped[item.domain]) grouped[item.domain] = [];
    grouped[item.domain].push(item);
  });

  Object.values(grouped).forEach(list => {
    list.sort((a, b) => {
      const bonusA = a.matched_terms.length ? 0.001 : 0;
      const bonusB = b.matched_terms.length ? 0.001 : 0;
      return (b.similarity + bonusB) - (a.similarity + bonusA);
    });
  });

  const selection = [];
  const domainCounts = {};
  let relatedCount = 0;
  const domainOrder = [...REL_ORDER, ...Object.keys(grouped).filter(dom => !REL_ORDER.includes(dom))];

  const addSelection = (item) => {
    selection.push(item);
    if (item.similarity !== null) {
      relatedCount += 1;
      domainCounts[item.domain] = (domainCounts[item.domain] || 0) + 1;
    }
  };

  const extras = [];

  domainOrder.forEach(domain => {
    const quota = REL_QUOTAS[domain] || { min: 0, max: grouped[domain] ? grouped[domain].length : 0 };
    const list = grouped[domain] || [];
    domainCounts[domain] = domainCounts[domain] || 0;

    const primaryCount = Math.min(quota.min, list.length);
    for (let i = 0; i < primaryCount; i += 1) {
      addSelection(list[i]);
    }

    const remainder = list.slice(primaryCount, typeof quota.max === "number" ? quota.max : undefined);
    remainder.forEach(item => extras.push(item));
  });

  extras.sort((a, b) => {
    if (b.similarity !== a.similarity) return b.similarity - a.similarity;
    return b.matched_terms.length - a.matched_terms.length;
  });

  extras.forEach(item => {
    if (relatedCount >= MAX_RELATED_ITEMS) return;
    const quota = REL_QUOTAS[item.domain] || { min: 0, max: Infinity };
    const max = typeof quota.max === "number" ? quota.max : Infinity;
    const current = domainCounts[item.domain] || 0;
    if (current >= max) return;
    addSelection(item);
  });

  domainOrder.forEach(domain => {
    const quota = REL_QUOTAS[domain];
    if (quota && quota.min > 0 && (!grouped[domain] || grouped[domain].length === 0)) {
      selection.push({
        domain,
        similarity: null,
        text: `해당 도메인 후보 없음 (임계값 ≥ ${threshold.toFixed(2)})`,
        matched_terms: []
      });
    }
  });

  const deduped = [];
  const seen = new Set();
  selection.forEach(item => {
    const key = `${item.domain}::${item.text}`;
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(item);
  });

  deduped.sort((a, b) => {
    const indexA = domainOrder.indexOf(a.domain);
    const indexB = domainOrder.indexOf(b.domain);
    if (indexA !== indexB) return indexA - indexB;
    const simA = a.similarity ?? -1;
    const simB = b.similarity ?? -1;
    if (simB !== simA) return simB - simA;
    return b.matched_terms.length - a.matched_terms.length;
  });

  const finalList = [];
  let counted = 0;
  deduped.forEach(item => {
    if (item.similarity === null) {
      finalList.push(item);
      return;
    }
    if (counted >= MAX_RELATED_ITEMS) return;
    finalList.push(item);
    counted += 1;
  });

  return finalList;
}

function reshapeLifeData(raw) {
  if (!raw || !Array.isArray(raw.items)) throw new Error("lifeskills.json 형식 오류");
  const itemMap = Object.fromEntries((raw.items || []).map(it => [it.id, { ...it }]));
  const domains = Array.isArray(raw.domains)
    ? raw.domains
        .map(domain => {
          const mappedItems = (domain.items || []).map(it => {
            const base = itemMap[it.id] ? { ...itemMap[it.id] } : { ...it };
            base.domainName = domain.name;
            base.domainIndex = domain.index;
            itemMap[base.id] = base;
            return base;
          });
          return {
            ...domain,
            items: mappedItems
          };
        })
        .sort((a, b) => (a.index || 0) - (b.index || 0))
    : [];
  return { ...raw, itemMap, domains };
}

async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} 로드 실패 (${res.status})`);
  return await res.json();
}

function findMappingRowByTitle(mappings, title) {
  if (!Array.isArray(mappings) || !mappings.length) return null;
  const norm = (s) => (s || "").toString().replace(/\s+/g, "").toLowerCase();
  const key = norm(title);
  let hit = mappings.find(x => norm(x.life_text).includes(key) && Array.isArray(x.related) && x.related.length);
  if (hit) return hit;
  const words = (title || "").split(/\s+/).filter(Boolean);
  const scored = mappings.map(x => {
    const parts = (x.life_text || "").split(/\s+/);
    const overlap = parts.filter(w => words.includes(w)).length;
    return { row: x, overlap };
  }).sort((a, b) => b.overlap - a.overlap);
  return scored[0] && scored[0].overlap > 0 ? scored[0].row : null;
}

function monthKeyToLabel(key) {
  if (!key) return "-";
  const [year, month] = key.split("-");
  return `${year}년 ${month}월`;
}

function sortedMonthKeys(evaluationsByMonth) {
  return Object.keys(evaluationsByMonth || {}).sort();
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function computeMonthlySummary(evaluationsByMonth) {
  const months = sortedMonthKeys(evaluationsByMonth);
  const masteredCounts = months.map(key => {
    const ev = evaluationsByMonth[key];
    const responses = ev?.responses || {};
    return Object.values(responses).filter(score => Number(score) >= 4).length;
  });
  const averageScores = months.map(key => {
    const ev = evaluationsByMonth[key];
    const responses = ev?.responses || {};
    const values = Object.values(responses).map(Number).filter(Number.isFinite);
    if (!values.length) return 0;
    return Math.round((values.reduce((acc, cur) => acc + cur, 0) / values.length) * 100) / 100;
  });

  // L4/L5 도달 문항 수 계산
  const l4l5Counts = months.map(key => {
    const ev = evaluationsByMonth[key];
    const responses = ev?.responses || {};
    const l4Count = Object.values(responses).filter(score => Number(score) === 4).length;
    const l5Count = Object.values(responses).filter(score => Number(score) === 5).length;
    return { l4: l4Count, l5: l5Count, total: l4Count + l5Count };
  });

  return { months, masteredCounts, averageScores, l4l5Counts };
}

function computeDomainTrend(evaluationsByMonth, lifeData) {
  const months = sortedMonthKeys(evaluationsByMonth);
  if (!months.length || !lifeData) return { months: [], datasets: [] };
  const datasets = (lifeData.domains || []).map((domain, index) => {
    const data = months.map(monthKey => {
      const ev = evaluationsByMonth[monthKey];
      if (!ev) return null;
      const scores = (domain.items || []).map(item => Number(ev.responses?.[item.id])).filter(Number.isFinite);
      if (!scores.length) return null;
      return Math.round((scores.reduce((sum, cur) => sum + cur, 0) / scores.length) * 100) / 100;
    });
    if (data.every(value => value === null)) return null;
    return {
      label: domain.name,
      data,
      borderColor: getColor(index, 0.9),
      backgroundColor: getColor(index, 0.15),
      spanGaps: true,
      tension: 0.25
    };
  }).filter(Boolean);
  return { months, datasets };
}

function computeItemScores(evaluation, lifeData) {
  if (!evaluation || !lifeData) return [];
  const entries = Object.entries(evaluation.responses || {}).map(([itemId, score]) => {
    const numeric = Number(score);
    if (!Number.isFinite(numeric)) return null;
    const item = lifeData.itemMap?.[itemId];
    if (!item) return null;
    return {
      label: `문항 ${item.number}`,
      title: item.title,
      domain: item.domainName || "",
      score: numeric
    };
  }).filter(Boolean);
  return entries.sort((a, b) => a.score - b.score);
}

function computeDomainAverages(evaluation, lifeData) {
  if (!evaluation || !lifeData) return [];
  return (lifeData.domains || []).map(domain => {
    const scores = (domain.items || []).map(item => Number(evaluation.responses?.[item.id])).filter(Number.isFinite);
    const avg = scores.length ? Math.round((scores.reduce((sum, cur) => sum + cur, 0) / scores.length) * 100) / 100 : 0;
    return { domain, average: avg };
  });
}

function findStrengthsAndNeeds(evaluation, lifeData) {
  if (!evaluation || !lifeData) return { strengths: [], needs: [] };
  const entries = Object.entries(evaluation.responses || {}).map(([itemId, score]) => {
    const numeric = Number(score);
    const item = lifeData.itemMap?.[itemId];
    return { item, score: numeric };
  }).filter(entry => entry.item && Number.isFinite(entry.score));
  const sorted = entries.sort((a, b) => b.score - a.score);
  return {
    strengths: sorted.slice(0, 3),
    needs: sorted.slice(-3).reverse()
  };
}

function removePrefix(text) {
  if (!text) return "";
  return text.replace(/^\([^)]+\)\s*/, "");
}

function sanitizeText(text) {
  return removePrefix(text || "").replace(/\s+/g, " ").trim();
}

function computeIepCode(domainName, item, levelKey) {
  const domainCode = sanitizeText(domainName || "영역").replace(/[^가-힣a-zA-Z0-9]/g, "");
  const itemNumber = item.number || (item.id ? item.id.replace(/\D+/g, "") : "00");
  const levelNum = Number(levelKey.replace(/[^0-9]/g, "")) || parseInt(levelKey.replace(/[^0-9]/g, ""), 10) || 0;
  return `L-${domainCode}-${itemNumber}-${String(levelNum || 0).padStart(2, "0")}`;
}

function buildInstructionalTexts(item, domainName, levelKey, levelText, studentName = "학생") {
  const title = item.title || "기술";
  const context = sanitizeText(item.sd || title).replace(/\.$/, "");
  const behavior = sanitizeText(item.behavior || title).replace(/\.$/, "");
  const target = sanitizeText(levelText || "");
  const goal = `${studentName}은(는) '${title}' 기술을 ${domainName ? `${domainName} 영역에서 ` : ""}${levelKey} 지원 수준 없이 일상 환경에서 수행한다.`;
  const procedure = [
    `준비물: '${title}' 지도에 필요한 실물·시각자료, 강화물, 기록지를 준비한다.`,
    `제시(변별자극): ${context ? `'${context}' 안내` : `'${title}' 수행 안내`}와 함께 단계별 시범·언어 프롬프트를 제공한다.`,
    `기대 반응: '${behavior || target || title}' 행동을 순서에 맞춰 독립적으로 수행한다.`,
    `오반응/무반응 시: 즉시 언어·모델·신체 프롬프트를 적용하고 필요한 단계부터 재시작한다.`,
    `강화 및 기록: 성공 시 구체적 칭찬과 강화물을 제공하고, 세션 기록지에 독립/촉구 수준 및 관찰 메모를 남긴다.`
  ].join(' ');
  const reinforcement = `성공 기준: 5회 시도 중 4회 이상 독립 수행을 3회기 연속 달성하면 ${domainName || "해당"} 영역 목표를 유지·일반화 단계로 전환한다.`;
  return { goal, procedure, reinforcement };
}

function extractLongTermGoalFromProcedure(procedure) {
  if (!procedure) return "";
  // 수업전략에서 "**장기 목표(Long-term Goal)**:" 또는 "**장기 목표**:" 다음 문장을 추출
  const match = procedure.match(/\*\*장기 목표(?:\(Long-term Goal\))?\*\*:?\s*\n(.+?)(?=\n\n|$)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

function extractIEPPlans(evaluation, lifeData, mappings, threshold, studentName, iepIndex) {
  if (!evaluation || !lifeData) return [];
  const result = [];
  (lifeData.domains || []).forEach(domain => {
    const candidates = [];
    (domain.items || []).forEach(item => {
      const levelKey = evaluation.levels?.[item.id];
      const score = Number(evaluation.responses?.[item.id]);
      if (!levelKey || !Number.isFinite(score)) return;
      const criteriaText = item.criteria?.[levelKey];
      if (!criteriaText) return;
      const code = computeIepCode(domain.name, item, levelKey);
      const libraryEntry = iepIndex?.[code];
      let goal, procedure, reinforcement;

      if (libraryEntry) {
        procedure = libraryEntry.procedure;
        reinforcement = libraryEntry.reinforcement;
        // iep_library.json의 goal 필드 직접 사용 (이미 장기 목표로 동기화됨)
        goal = libraryEntry.goal;
      } else {
        const built = buildInstructionalTexts(item, domain.name, levelKey, criteriaText, studentName);
        goal = built.goal;
        procedure = built.procedure;
        reinforcement = built.reinforcement;
      }

      // 관련 목표 문장 추출 (관련도 기반, 임계값 필터링)
      const relatedGoals = libraryEntry?.related_goals || [];
      const aboveThreshold = relatedGoals.filter(rg => rg.similarity >= threshold);

      // 임계값 이상이 충분하면 사용, 아니면 최소 3개 보장 (유사도 순)
      const finalRelated = aboveThreshold.length >= 3
        ? aboveThreshold
        : relatedGoals.slice(0, Math.max(3, aboveThreshold.length));

      const related = finalRelated.map(rg => ({
        domain: rg.curriculum,
        text: rg.text,
        code: rg.code,
        area: rg.area,
        similarity: rg.similarity,
        matched_terms: []
      }));

      candidates.push({
        code,
        item,
        levelKey,
        criteriaText,
        goal,
        procedure,
        reinforcement,
        related,
        score
      });
    });
    if (candidates.length) {
      candidates.sort((a, b) => {
        if (a.score !== b.score) return a.score - b.score;
        const numA = Number(a.item.number) || 0;
        const numB = Number(b.item.number) || 0;
        return numA - numB;
      });
      const best = candidates[0];
      result.push({ domain, plans: [best] });
    }
  });
  return result;
}

function buildTimelineRows(evaluationsByMonth) {
  const months = sortedMonthKeys(evaluationsByMonth);
  return months.map(key => {
    const ev = evaluationsByMonth[key];
    const responses = ev?.responses || {};
    const scores = Object.values(responses).map(Number).filter(Number.isFinite);
    const avg = scores.length ? Math.round((scores.reduce((acc, cur) => acc + cur, 0) / scores.length) * 100) / 100 : 0;
    const mastery = scores.filter(score => score >= 4).length;
    return {
      key,
      average: avg,
      mastery,
      savedAt: ev?.savedAt || "-"
    };
  });
}

function generateRecentMonthKeys(count = 18) {
  const result = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let i = 0; i < count; i += 1) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    result.push(`${year}-${month}`);
    cursor.setMonth(cursor.getMonth() - 1);
  }
  return result;
}

function Alerts({ alerts, onDismiss }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {alerts.map(alert => (
        <div key={alert.id} className={`toast toast-${alert.type}`}>
          <span>{alert.message}</span>
          <button type="button" onClick={() => onDismiss(alert.id)} aria-label="알림 닫기">×</button>
        </div>
      ))}
    </div>
  );
}

function TabNav({ activeTab, onChange }) {
  const tabs = [
    { key: TAB_KEYS.students, label: "학생 등록" },
    { key: TAB_KEYS.evaluation, label: "평가 도구" },
    { key: TAB_KEYS.report, label: "결과 보고서" },
    { key: TAB_KEYS.dashboard, label: "학생별 대시보드" },
    { key: TAB_KEYS.goals, label: "목표 목록" }
  ];
  return (
    <nav className="tab-nav" aria-label="G-LENS 탭">
      {tabs.map(tab => (
        <button
          key={tab.key}
          type="button"
          className={`tab-btn${activeTab === tab.key ? " active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function StudentRegistrationTab({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) {
  const [form, setForm] = useState({
    name: "",
    birth: "",
    grade: "",
    homeroom_teacher: "",
    subject_teacher: "",
    disability_type: "",
    behavior_level: "",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);
  const gradeOptions = ["유치원", "초1", "초2", "초3", "초4", "초5", "초6", "중1", "중2", "중3", "고1", "고2", "고3", "전1", "전2"];
  const disabilityTypes = ["지적장애", "자폐성장애", "지적·자폐성장애", "정서행동장애", "학습장애", "의사소통장애", "지체장애", "건강장애", "시각장애", "청각장애", "발달지체"];
  const behaviorLevels = [
    "문제행동 없음",
    "경미한 문제행동(일반적 생활지도로 충분)",
    "문제행동(예방적 중재 필요)",
    "문제행동(개별 행동중재계획 필요)",
    "위기행동(개별 위기관리계획 필요)"
  ];
  const [gradeMode, setGradeMode] = useState("preset");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      birth: student.birth || "",
      grade: student.grade || "",
      homeroom_teacher: student.homeroom_teacher || "",
      subject_teacher: student.subject_teacher || "",
      disability_type: student.disability_type || "",
      behavior_level: student.behavior_level || "",
      notes: student.notes || ""
    });
    setEditingId(student.id);
    setGradeMode(gradeOptions.includes(student.grade) ? "preset" : "custom");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      birth: "",
      grade: "",
      homeroom_teacher: "",
      subject_teacher: "",
      disability_type: "",
      behavior_level: "",
      notes: ""
    });
    setGradeMode("preset");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const studentData = {
      name: form.name.trim(),
      birth: form.birth,
      grade: form.grade.trim(),
      homeroom_teacher: form.homeroom_teacher.trim(),
      subject_teacher: form.subject_teacher.trim(),
      disability_type: form.disability_type,
      behavior_level: form.behavior_level,
      notes: form.notes.trim()
    };

    if (editingId) {
      // 수정 모드
      onUpdateStudent(editingId, studentData);
      setEditingId(null);
    } else {
      // 등록 모드
      const newStudent = {
        id: generateId("stu"),
        ...studentData
      };
      onAddStudent(newStudent);
    }

    setForm({
      name: "",
      birth: "",
      grade: "",
      homeroom_teacher: "",
      subject_teacher: "",
      disability_type: "",
      behavior_level: "",
      notes: ""
    });
    setGradeMode("preset");
  };

  return (
    <section className="card">
      <h2>👩‍🏫 학생 등록 및 목록</h2>
      <p className="muted">학생 기본 정보를 입력하면 평가 도구·보고서·대시보드에서 바로 활용할 수 있습니다.</p>
      {editingId && (
        <div style={{ padding: '10px 14px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '10px', marginBottom: '14px', fontSize: '14px' }}>
          ✏️ <strong>수정 모드</strong> - 학생 정보를 수정하고 있습니다.
        </div>
      )}
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="student-form-grid">
          <label>
            <span>학생 이름 *</span>
            <input type="text" value={form.name} onChange={(event) => handleChange("name", event.target.value)} required/>
          </label>
          <label>
            <span>생년월일</span>
            <input type="date" value={form.birth} onChange={(event) => handleChange("birth", event.target.value)}/>
          </label>
          <label>
            <span>학년</span>
            <select
              value={gradeMode === "preset" ? form.grade : "__custom"}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "__custom") {
                  setGradeMode("custom");
                  handleChange("grade", "");
                } else {
                  setGradeMode("preset");
                  handleChange("grade", value);
                }
              }}
            >
              <option value="">선택하세요</option>
              {gradeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
              <option value="__custom">직접 입력</option>
            </select>
            {gradeMode === "custom" ? (
              <input
                type="text"
                value={form.grade}
                onChange={(event) => handleChange("grade", event.target.value)}
                placeholder="예) 전공과 1년"
                className="inline-input"
              />
            ) : null}
          </label>
          <label>
            <span>담임교사</span>
            <input type="text" value={form.homeroom_teacher} onChange={(event) => handleChange("homeroom_teacher", event.target.value)} placeholder="예) 김선생"/>
          </label>
          <label>
            <span>교과담당교사</span>
            <input type="text" value={form.subject_teacher} onChange={(event) => handleChange("subject_teacher", event.target.value)} placeholder="예) 이선생, 박선생"/>
          </label>
          <label>
            <span>장애 유형</span>
            <select value={form.disability_type} onChange={(event) => handleChange("disability_type", event.target.value)}>
              <option value="">선택하세요</option>
              {disabilityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            <span>문제행동 수준</span>
            <select value={form.behavior_level} onChange={(event) => handleChange("behavior_level", event.target.value)}>
              <option value="">선택하세요</option>
              {behaviorLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </label>
          <label style={{ gridColumn: '1 / -1' }}>
            <span>메모</span>
            <textarea rows={3} value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} placeholder="기타 특이사항이나 참고할 내용을 입력하세요"/>
          </label>
        </div>
        <div className="student-form-actions">
          {editingId ? (
            <>
              <button type="submit" className="btn primary">수정 완료</button>
              <button type="button" className="btn" onClick={handleCancelEdit}>취소</button>
            </>
          ) : (
            <button type="submit" className="btn primary">학생 등록</button>
          )}
        </div>
      </form>

      <div className="student-table">
        <div className="student-table-head">
          <span>이름</span>
          <span>생년월일</span>
          <span>학년</span>
          <span>담임교사</span>
          <span>교과담당</span>
          <span>장애유형</span>
          <span>문제행동</span>
          <span>메모</span>
          <span>작업</span>
        </div>
        {students.map(student => (
          <div key={student.id} className="student-row">
            <strong>{student.name}</strong>
            <span>{student.birth || "-"}</span>
            <span>{student.grade || "-"}</span>
            <span>{student.homeroom_teacher || "-"}</span>
            <span>{student.subject_teacher || "-"}</span>
            <span>{student.disability_type || "-"}</span>
            <span style={{ fontSize: '11px' }}>{student.behavior_level || "-"}</span>
            <span>{student.notes || "-"}</span>
            <span style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn light"
                onClick={() => handleEdit(student)}
                style={{ fontSize: '12px', padding: '4px 8px' }}
              >
                ✏️ 수정
              </button>
              <button
                type="button"
                className="btn light"
                onClick={() => onDeleteStudent(student.id)}
                style={{ fontSize: '12px', padding: '4px 8px', color: '#dc2626' }}
              >
                🗑️ 삭제
              </button>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EvaluationTab({
  students,
  lifeData,
  evaluations,
  onSaveEvaluation
}) {
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const recentMonthKeys = useMemo(() => generateRecentMonthKeys(18), []);
  const [selectedMonth, setSelectedMonth] = useState(recentMonthKeys[0] || new Date().toISOString().slice(0, 7));
  const [responses, setResponses] = useState({});
  const [levels, setLevels] = useState({});
  const [focusedItemIndex, setFocusedItemIndex] = useState(0);
  const [keyboardHintsVisible, setKeyboardHintsVisible] = useState(true);

  // 전체 평가 항목 리스트 계산
  const allItems = useMemo(() => {
    if (!lifeData?.domains) return [];
    return lifeData.domains.flatMap(domain =>
      (domain.items || []).map(item => ({
        ...item,
        domainName: domain.name,
        itemId: item.id || `item_${item.number}`
      }))
    );
  }, [lifeData]);

  // 도메인별 진행률 계산
  const domainProgress = useMemo(() => {
    if (!lifeData?.domains) return [];
    return lifeData.domains.map(domain => {
      const domainItems = domain.items || [];
      const total = domainItems.length;
      const completed = domainItems.filter(item => {
        const itemId = item.id || `item_${item.number}`;
        return levels[itemId];
      }).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        domain,
        total,
        completed,
        percentage
      };
    });
  }, [lifeData, levels]);

  // 전체 진행률
  const overallProgress = useMemo(() => {
    const total = allItems.length;
    const completed = allItems.filter(item => levels[item.itemId]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [allItems, levels]);

  useEffect(() => {
    if (!selectedStudent || !selectedMonth) return;
    const stored = evaluations[selectedStudent]?.[selectedMonth];
    setResponses(stored?.responses || {});
    setLevels(stored?.levels || {});
  }, [selectedStudent, selectedMonth, evaluations]);

  const monthOptions = useMemo(() => {
    const stored = Object.keys(evaluations[selectedStudent] || {});
    const merged = Array.from(new Set([...recentMonthKeys, ...stored])).sort().reverse();
    return merged;
  }, [recentMonthKeys, evaluations, selectedStudent]);

  useEffect(() => {
    if (!monthOptions.length) return;
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0]);
    }
  }, [monthOptions]);

  const handleScoreChange = (itemId, value) => {
    setResponses(prev => ({ ...prev, [itemId]: value }));
  };

  const handleLevelToggle = (itemId, levelKey, allowUnset = false) => {
    const current = levels[itemId];
    const nextLevel = current === levelKey && allowUnset ? undefined : levelKey;

    setLevels(prev => {
      const updated = { ...prev };
      if (nextLevel) updated[itemId] = nextLevel;
      else delete updated[itemId];
      return updated;
    });

    setResponses(prev => {
      const updated = { ...prev };
      if (nextLevel) {
        const numeric = Number(levelKey.replace(/^\D+/, ""));
        if (Number.isFinite(numeric)) {
          updated[itemId] = numeric;
        } else {
          delete updated[itemId];
        }
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!selectedStudent || !selectedMonth) return;
    onSaveEvaluation(selectedStudent, selectedMonth, {
      responses,
      levels,
      savedAt: new Date().toISOString()
    });
  };

  // 키보드 네비게이션 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 입력 필드에 포커스가 있으면 무시
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      const currentItem = allItems[focusedItemIndex];
      if (!currentItem) return;
      const itemId = currentItem.itemId;

      // 숫자 키 1-5: 레벨 선택
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const levelKey = `L${e.key}`;
        const criteria = currentItem.criteria || {};
        if (criteria[levelKey]) {
          handleLevelToggle(itemId, levelKey);
          // 자동 저장 (debounce)
          clearTimeout(window._evaluationAutoSaveTimer);
          window._evaluationAutoSaveTimer = setTimeout(() => {
            handleSave();
          }, 1000);
        }
        return;
      }

      // Tab: 다음 항목
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        setFocusedItemIndex(prev => Math.min(prev + 1, allItems.length - 1));
        return;
      }

      // Shift+Tab: 이전 항목
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        setFocusedItemIndex(prev => Math.max(prev - 1, 0));
        return;
      }

      // ArrowDown: 다음 항목
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedItemIndex(prev => Math.min(prev + 1, allItems.length - 1));
        return;
      }

      // ArrowUp: 이전 항목
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedItemIndex(prev => Math.max(prev - 1, 0));
        return;
      }

      // Enter: 다음 미평가 항목으로 이동
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextUnevaluated = allItems.findIndex((item, idx) =>
          idx > focusedItemIndex && !levels[item.itemId]
        );
        if (nextUnevaluated !== -1) {
          setFocusedItemIndex(nextUnevaluated);
        }
        return;
      }

      // Space: 기준 상세 토글 (구현은 UI에서)
      if (e.key === ' ') {
        e.preventDefault();
        const detailsEl = document.querySelector(`#criteria-${itemId}`);
        if (detailsEl) {
          detailsEl.open = !detailsEl.open;
        }
        return;
      }

      // Ctrl+S 또는 Cmd+S: 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
        return;
      }

      // H: 도움말 토글
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setKeyboardHintsVisible(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (window._evaluationAutoSaveTimer) {
        clearTimeout(window._evaluationAutoSaveTimer);
      }
    };
  }, [allItems, focusedItemIndex, levels, handleSave, handleLevelToggle]);

  // 포커스된 항목으로 스크롤
  useEffect(() => {
    const currentItem = allItems[focusedItemIndex];
    if (!currentItem) return;
    const itemElement = document.querySelector(`[data-item-id="${currentItem.itemId}"]`);
    if (itemElement) {
      itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedItemIndex, allItems]);

  return (
    <section className="card evaluation-tab">
      <div className="evaluation-header">
        <div>
          <h2>🧭 LifeSkills 평가 도구</h2>
          <p className="muted">학생과 평가 월을 선택하면 이전 결과가 자동으로 불러와집니다. 점수와 세부 기준만 업데이트하세요.</p>
        </div>
        <div className="evaluation-controls">
          <label>
            <span>학생 선택</span>
            <select value={selectedStudent} onChange={(event) => setSelectedStudent(event.target.value)}>
              {students.map(student => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>평가 월</span>
            <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
              {monthOptions.map(option => (
                <option key={option} value={option}>{monthKeyToLabel(option)}</option>
              ))}
            </select>
          </label>
          <button type="button" className="btn primary" onClick={handleSave}>평가 저장</button>
        </div>
      </div>

      {keyboardHintsVisible && (
        <div style={{
          padding: '12px 16px',
          background: '#eef2ff',
          border: '1px solid #c7d2fe',
          borderRadius: '10px',
          marginTop: '12px',
          fontSize: '13px',
          color: '#1e3a8a'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>⌨️ 키보드 단축키</strong>
            <button
              onClick={() => setKeyboardHintsVisible(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>
          <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            <div><kbd style={{ padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>1-5</kbd> 레벨 선택</div>
            <div><kbd style={{ padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>↑/↓</kbd> 이전/다음 항목</div>
            <div><kbd style={{ padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>Enter</kbd> 다음 미평가 항목</div>
            <div><kbd style={{ padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>Ctrl+S</kbd> 저장</div>
            <div><kbd style={{ padding: '2px 6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px' }}>H</kbd> 도움말 토글</div>
          </div>
        </div>
      )}

      {/* 전체 진행률 표시 */}
      <div style={{
        padding: '16px',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        marginTop: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <strong style={{ fontSize: '15px', color: '#1f2937' }}>📊 평가 진행률</strong>
          <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: '700' }}>
            {overallProgress.completed} / {overallProgress.total} 항목 ({overallProgress.percentage}%)
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
        {overallProgress.percentage === 100 && (
          <div style={{ marginTop: '10px', padding: '8px 12px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '8px', fontSize: '13px', color: '#047857' }}>
            ✓ 모든 항목 평가 완료!
          </div>
        )}
      </div>

      {!lifeData ? (
        <div className="muted">lifeskills 데이터를 불러오는 중입니다.</div>
      ) : (
        <div className="questions">
          {(lifeData.domains || []).map((domain, domainIdx) => {
            const progress = domainProgress[domainIdx] || { completed: 0, total: 0, percentage: 0 };
            return (
              <section key={domain.name} className="domain-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0 }}>📊 영역 {domain.index}: {domain.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {progress.completed}/{progress.total}
                    </span>
                    <div style={{ width: '120px', height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progress.percentage}%`,
                        height: '100%',
                        background: progress.percentage === 100 ? '#10b981' : '#2563eb',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: progress.percentage === 100 ? '#10b981' : '#2563eb', minWidth: '40px' }}>
                      {progress.percentage}%
                    </span>
                  </div>
                </div>
                <div className="domain-items">
                {(domain.items || []).map((item, itemIdx) => {
                  const itemId = item.id || `item_${item.number}`;
                  const selectedLevel = levels[itemId];
                  const levelEntries = Object.entries(item.criteria || {}).sort((a, b) => a[0].localeCompare(b[0]));
                  const globalItemIndex = allItems.findIndex(i => i.itemId === itemId);
                  const isFocused = globalItemIndex === focusedItemIndex;
                  return (
                    <article
                      key={itemId}
                      className="item"
                      data-item-id={itemId}
                      onClick={() => setFocusedItemIndex(globalItemIndex)}
                      style={{
                        outline: isFocused ? '3px solid #2563eb' : 'none',
                        boxShadow: isFocused ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : undefined,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="item-head">
                        <span className="subscale">
                          {isFocused && '▶ '}문항 {item.number}
                        </span>
                        <span className="qtitle">{item.title}</span>
                        {selectedLevel && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: '#10b981',
                            color: '#fff',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            ✓ {selectedLevel}
                          </span>
                        )}
                      </div>
                      <div className="item-meta">
                        {item.sd ? (
                          <p><strong>상황 (SD)</strong> {item.sd}</p>
                        ) : null}
                        {item.behavior ? (
                          <p><strong>관찰 행동</strong> {item.behavior}</p>
                        ) : null}
                      </div>
                      {levelEntries.length ? (
                        <div className="criteria-checklist">
                          <span className="criteria-label">세부 기준 (현재 수준에 해당하는 하나만 선택하세요)</span>
                          <ul>
                            {levelEntries.map(([levelKey, text]) => {
                              const selected = selectedLevel === levelKey;
                              return (
                                <li key={levelKey}>
                                  <label className={`level-option${selected ? " selected" : ""}`}>
                                    <input
                                      type="radio"
                                      className="level-input"
                                      name={`level-${itemId}`}
                                      value={levelKey}
                                      checked={selected}
                                      onChange={() => handleLevelToggle(itemId, levelKey)}
                                      onClick={(event) => {
                                        if (selected) {
                                          event.preventDefault();
                                          handleLevelToggle(itemId, levelKey, true);
                                        }
                                      }}
                                    />
                                    <div className="level-text">
                                      <strong>{levelKey}</strong> {text}
                                    </div>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button type="button" className="btn primary" onClick={handleSave}>평가 저장</button>
      </div>
    </section>
  );
}

function ProcedureToggle({ procedure, reinforcement, showByDefault = true }) {
  const [isOpen, setIsOpen] = useState(showByDefault);

  return (
    <div className="lto-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
           onClick={() => setIsOpen(!isOpen)}>
        <strong>수업 전략</strong>
        <span style={{ fontSize: '18px' }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <>
          <p style={{ whiteSpace: 'pre-line', marginTop: '8px' }}>{procedure}</p>
          <p className="muted" style={{ whiteSpace: 'pre-line' }}>{reinforcement}</p>
        </>
      )}
    </div>
  );
}

function RelatedStandardsToggle({ related, showByDefault = false }) {
  const [isOpen, setIsOpen] = useState(showByDefault);

  if (!related || related.length === 0) {
    return <div className="muted" style={{ marginTop: '12px' }}>임계값 이상 관련 기준을 찾지 못했습니다.</div>;
  }

  const simBadge = (sim) => {
    if (sim >= 0.3) return '🟢';
    if (sim >= 0.2) return '🟡';
    return '🔴';
  };

  const fmtSim = (sim) => (sim * 100).toFixed(0) + '%';

  return (
    <div className="lto-box" style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
           onClick={() => setIsOpen(!isOpen)}>
        <strong>관련 기준 및 기술</strong>
        <span style={{ fontSize: '18px' }}>{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          {related.map((rel, idx) => (
            <li key={`${rel.domain}-${idx}-${rel.text}`} style={{ marginBottom: '6px', fontSize: '14px' }}>
              {rel.similarity === null ? "▫️" : simBadge(rel.similarity)} <b>[{rel.domain}]</b>{" "}
              ({rel.similarity === null ? "—" : fmtSim(rel.similarity)}) <b>{rel.code}</b> {rel.text}
              {rel.matched_terms?.length ? <small> matched: {rel.matched_terms.join(", ")}</small> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReportContent({
  student,
  monthKey,
  evaluation,
  evaluationsByMonth,
  lifeData,
  mappings,
  threshold,
  iepIndex
}) {
  const domainBarRef = useRef(null);
  const itemBarTopRef = useRef(null);
  const itemBarBottomRef = useRef(null);
  const levelDistRef = useRef(null);
  const monthlyLineRef = useRef(null);
  const domainTrendRef = useRef(null);
  const growthCurveRef = useRef(null);
  const chartInstancesRef = useRef({
    domainBar: null,
    itemBarTop: null,
    itemBarBottom: null,
    levelDist: null,
    monthlyLine: null,
    domainTrend: null,
    growthCurve: null
  });

  const domainAverages = useMemo(() => computeDomainAverages(evaluation, lifeData), [evaluation, lifeData]);
  const { strengths, needs } = useMemo(() => findStrengthsAndNeeds(evaluation, lifeData), [evaluation, lifeData]);
  const plans = useMemo(() => extractIEPPlans(evaluation, lifeData, mappings, threshold, student?.name || "학생", iepIndex), [evaluation, lifeData, mappings, threshold, student, iepIndex]);
  const timeline = useMemo(() => buildTimelineRows(evaluationsByMonth), [evaluationsByMonth]);
  const allItemScores = useMemo(() => computeItemScores(evaluation, lifeData), [evaluation, lifeData]);
  const itemScoresTop = useMemo(() => {
    return [...allItemScores].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [allItemScores]);
  const itemScoresBottom = useMemo(() => {
    return [...allItemScores].sort((a, b) => a.score - b.score).slice(0, 10);
  }, [allItemScores]);

  // 수준별 분포 데이터 (추가 차트용)
  const levelDistribution = useMemo(() => {
    if (!evaluation || !lifeData) return null;
    const levels = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
    Object.entries(evaluation.levels || {}).forEach(([itemId, level]) => {
      if (levels.hasOwnProperty(level)) {
        levels[level]++;
      }
    });
    return levels;
  }, [evaluation, lifeData]);

  // 영역-색상 매핑 생성 (일관된 색상 사용)
  const domainColorMap = useMemo(() => {
    const map = {};
    (lifeData?.domains || []).forEach((domain, idx) => {
      map[domain.name] = getColor(idx, 0.75);
    });
    return map;
  }, [lifeData]);
  const monthlySummary = useMemo(() => computeMonthlySummary(evaluationsByMonth), [evaluationsByMonth]);
  const domainTrend = useMemo(() => computeDomainTrend(evaluationsByMonth, lifeData), [evaluationsByMonth, lifeData]);
  const recommendedGoals = useMemo(() => {
    const seen = new Set();
    return plans.flatMap(domainPlan => domainPlan.plans.map(plan => ({
      ...plan,
      domain: domainPlan.domain.name
    }))).filter(plan => {
      if (seen.has(plan.code)) return false;
      seen.add(plan.code);
      return true;
    });
  }, [plans]);

  // 성장 곡선 데이터 계산 (도메인별 추세 + 예측)
  const growthCurveData = useMemo(() => {
    const monthKeys = Object.keys(evaluationsByMonth).sort();
    if (monthKeys.length < 2) return null;

    // 도메인별 월별 평균 점수 계산
    const domainData = (lifeData?.domains || []).map(domain => {
      const scores = monthKeys.map(mk => {
        const evalData = evaluationsByMonth[mk];
        const domainItems = domain.items || [];
        const domainScores = domainItems
          .map(item => evalData?.responses?.[item.id || `item_${item.number}`])
          .filter(score => score !== undefined);
        return domainScores.length > 0
          ? domainScores.reduce((a, b) => a + b, 0) / domainScores.length
          : null;
      });
      return { domain: domain.name, scores };
    });

    // 선형 회귀로 추세선 및 예측 계산
    const predict = (scores) => {
      const validPoints = scores.map((s, i) => ({ x: i, y: s })).filter(p => p.y !== null);
      if (validPoints.length < 2) return [];

      const n = validPoints.length;
      const sumX = validPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = validPoints.reduce((sum, p) => sum + p.y, 0);
      const sumXY = validPoints.reduce((sum, p) => sum + p.x * p.y, 0);
      const sumX2 = validPoints.reduce((sum, p) => sum + p.x * p.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // 현재 + 미래 3개월 예측
      const predictions = [];
      for (let i = 0; i < scores.length + 3; i++) {
        predictions.push(Math.max(0, Math.min(5, intercept + slope * i)));
      }
      return predictions;
    };

    return {
      months: [...monthKeys, ...['예측1', '예측2', '예측3']],
      domainData: domainData.map(dd => ({
        ...dd,
        predictions: predict(dd.scores)
      }))
    };
  }, [evaluationsByMonth, lifeData]);

  useEffect(() => {
    const instances = chartInstancesRef.current;
    Object.keys(instances).forEach(key => {
      if (instances[key]) {
        instances[key].destroy();
        instances[key] = null;
      }
    });

    if (!evaluation) return;
    if (typeof window === "undefined") return;
    const ChartLib = window.Chart?.Chart || window.Chart?.default || window.Chart;
    if (typeof ChartLib !== "function") {
      console.warn("Chart.js 라이브러리를 찾을 수 없어 그래프를 생략합니다.");
      return;
    }
    const safeCreate = (fn) => {
      try {
        return fn();
      } catch (error) {
        console.error("차트 렌더링 오류:", error);
        return null;
      }
    };

    if (domainBarRef.current && domainAverages.length) {
      instances.domainBar = safeCreate(() => new ChartLib(domainBarRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: domainAverages.map(entry => entry.domain.name),
          datasets: [{
            label: "평균 점수",
            data: domainAverages.map(entry => entry.average),
            backgroundColor: domainAverages.map((_, idx) => getColor(idx, 0.75)),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 11 },
              color: '#374151'
            }
          }
        }
      }));
    }

    // 상위 10개 차트
    if (itemBarTopRef.current && itemScoresTop.length) {
      instances.itemBarTop = safeCreate(() => new ChartLib(itemBarTopRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: itemScoresTop.map(entry => `${entry.label} (${entry.domain})`),
          datasets: [{
            label: "점수",
            data: itemScoresTop.map(entry => entry.score),
            backgroundColor: itemScoresTop.map(entry => domainColorMap[entry.domain] || getColor(0, 0.75))
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 10 },
              color: '#374151'
            }
          }
        }
      }));
    }

    // 하위 10개 차트
    if (itemBarBottomRef.current && itemScoresBottom.length) {
      instances.itemBarBottom = safeCreate(() => new ChartLib(itemBarBottomRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: itemScoresBottom.map(entry => `${entry.label} (${entry.domain})`),
          datasets: [{
            label: "점수",
            data: itemScoresBottom.map(entry => entry.score),
            backgroundColor: itemScoresBottom.map(entry => domainColorMap[entry.domain] || getColor(7, 0.75))
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 10 },
              color: '#374151'
            }
          }
        }
      }));
    }

    // 수준별 분포 차트 (추가 차트)
    if (levelDistRef.current && levelDistribution) {
      instances.levelDist = safeCreate(() => new ChartLib(levelDistRef.current.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ['L1 (기초)', 'L2 (신체촉구)', 'L3 (언어촉구)', 'L4 (부분독립)', 'L5 (완전독립)'],
          datasets: [{
            label: "문항 수",
            data: [levelDistribution.L1, levelDistribution.L2, levelDistribution.L3, levelDistribution.L4, levelDistribution.L5],
            backgroundColor: [
              getColor(7, 0.75), // L1 - 빨강
              getColor(6, 0.75), // L2 - 주황
              getColor(4, 0.75), // L3 - 노랑
              getColor(2, 0.75), // L4 - 연두
              getColor(0, 0.75)  // L5 - 초록
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right" },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed}개 (${percentage}%)`;
                }
              }
            },
            datalabels: {
              formatter: (value) => value > 0 ? value : '',
              color: '#fff',
              font: { weight: 'bold', size: 14 }
            }
          }
        }
      }));
    }

    if (monthlyLineRef.current && monthlySummary.months.length) {
      instances.monthlyLine = safeCreate(() => new ChartLib(monthlyLineRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: monthlySummary.months,
          datasets: [
            {
              label: "L4 이상 도달",
              data: monthlySummary.l4l5Counts.map(d => d.total),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: '#10b981',
              fill: true,
              datalabels: {
                align: 'top',
                anchor: 'end',
                offset: 4,
                formatter: (value) => value > 0 ? value + '개' : '',
                font: { weight: 'bold', size: 11 },
                color: '#065f46',
                backgroundColor: 'rgba(209, 250, 229, 0.9)',
                borderRadius: 3,
                padding: 3
              }
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 45,
              ticks: {
                stepSize: 5
              },
              title: {
                display: true,
                text: '문항 수',
                font: { size: 12, weight: 'bold' }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + '개';
                }
              }
            }
          }
        }
      }));
    }

    if (domainTrendRef.current && domainTrend.datasets.length) {
      instances.domainTrend = safeCreate(() => new ChartLib(domainTrendRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: domainTrend.months,
          datasets: domainTrend.datasets.map((dataset, idx) => ({
            ...dataset,
            borderColor: getColor(idx, 0.85),
            backgroundColor: getColor(idx, 0.12),
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: getColor(idx, 1),
            datalabels: {
              align: 'top',
              anchor: 'end',
              offset: 2,
              formatter: (value) => value !== null ? value.toFixed(1) : '',
              font: { weight: 'bold', size: 9 },
              color: '#1f2937',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              padding: 1
            }
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { position: "bottom" }
          }
        }
      }));
    }

    // 성장 곡선 차트 (예측 포함)
    if (growthCurveRef.current && growthCurveData) {
      const actualDataLength = growthCurveData.domainData[0]?.scores.length || 0;
      instances.growthCurve = safeCreate(() => new ChartLib(growthCurveRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: growthCurveData.months.map((m, i) =>
            i >= growthCurveData.months.length - 3 ? m : monthKeyToLabel(m)
          ),
          datasets: growthCurveData.domainData.map((dd, idx) => {
            const scoresLength = dd.scores.length;
            return {
              label: dd.domain,
              data: dd.predictions,
              borderColor: getColor(idx, 0.85),
              backgroundColor: getColor(idx, 0.12),
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: getColor(idx, 1),
              segment: {
                borderDash: (ctx) => {
                  // 예측 부분은 점선으로
                  return ctx.p0DataIndex >= scoresLength - 1 ? [5, 5] : [];
                }
              }
            };
          })
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 5, title: { display: true, text: '평균 점수' } },
            x: { title: { display: true, text: '평가 시점' } }
          },
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: '📈 성장 곡선 및 추세 예측', font: { size: 16 } },
            datalabels: { display: false }
          }
        }
      }));
    }

    return () => {
      Object.keys(instances).forEach(key => {
        if (instances[key]) {
          instances[key].destroy();
          instances[key] = null;
        }
      });
    };
  }, [evaluation, domainAverages, itemScoresTop, itemScoresBottom, levelDistribution, domainColorMap, monthlySummary, domainTrend, growthCurveData]);

  if (!student || !evaluation) {
    return (
      <div className="muted">선택된 학생과 평가 월에 대한 데이터가 없습니다. 평가 도구에서 저장 후 다시 확인하세요.</div>
    );
  }

  return (
    <div className="report-body">
      <header className="report-header">
        <div>
          <h2>G-LENS 결과 보고서</h2>
          <p className="muted">LifeSkills 45문항 기반 평가 결과 · VB-MAPP 매핑 · IEP 설계 가이드</p>
        </div>
        <div className="report-meta">
          <span><strong>평가 월</strong> {monthKeyToLabel(monthKey)}</span>
          <span><strong>생성일</strong> {new Date().toLocaleDateString("ko-KR")}</span>
        </div>
      </header>

      <section className="report-section">
        <h3>평가 개요 및 목적</h3>
        <p className="muted">
          본 보고서는 G-LENS(경은학교 LifeSkills 평가·IEP 내비게이터)를 활용하여 학생의 일상생활·사회적 상호작용·학습 준비도 등을 종합적으로 진단하고,
          VB-MAPP·PBIS·교육과정·EFL 기준과 연계한 IEP 목표 설계를 지원합니다.
        </p>
      </section>

      <section className="report-section">
        <h3>학생 기본 정보</h3>
        <div className="info-grid">
          <div><strong>학생</strong><span>{student.name}</span></div>
          <div><strong>생년월일</strong><span>{student.birth || "-"}</span></div>
          <div><strong>학년</strong><span>{student.grade || "-"}</span></div>
          <div><strong>담임교사</strong><span>{student.homeroom_teacher || "-"}</span></div>
          <div><strong>교과교사</strong><span>{student.subject_teacher || "-"}</span></div>
          <div><strong>장애유형</strong><span>{student.disability_type || "-"}</span></div>
          <div><strong>행동수준</strong><span>{student.behavior_level || "-"}</span></div>
          <div><strong>기록 메모</strong><span>{student.notes || "-"}</span></div>
        </div>
      </section>

      <section className="report-section">
        <h3>핵심 지표 시각화</h3>
        <div className="report-charts">
          <div className="chart-card">
            <h4>영역별 평균 점수</h4>
            {domainAverages.length ? (
              <div className="chart-canvas">
                <canvas ref={domainBarRef} aria-label="영역별 평균 점수"></canvas>
              </div>
            ) : (
              <p className="muted">영역별 점수를 계산할 데이터가 부족합니다.</p>
            )}
          </div>
          <div className="chart-card">
            <h4>문항별 점수 (상위 10개)</h4>
            {itemScoresTop.length ? (
              <div className="chart-canvas">
                <canvas ref={itemBarTopRef} aria-label="문항별 점수 상위"></canvas>
              </div>
            ) : (
              <p className="muted">문항 점수를 계산할 데이터가 부족합니다.</p>
            )}
          </div>
        </div>
        <div className="report-charts">
          <div className="chart-card">
            <h4>문항별 점수 (하위 10개)</h4>
            {itemScoresBottom.length ? (
              <div className="chart-canvas">
                <canvas ref={itemBarBottomRef} aria-label="문항별 점수 하위"></canvas>
              </div>
            ) : (
              <p className="muted">문항 점수를 계산할 데이터가 부족합니다.</p>
            )}
          </div>
          <div className="chart-card">
            <h4>수준별 문항 분포</h4>
            {levelDistribution ? (
              <div className="chart-canvas">
                <canvas ref={levelDistRef} aria-label="수준별 분포"></canvas>
              </div>
            ) : (
              <p className="muted">수준 데이터가 없습니다.</p>
            )}
          </div>
        </div>
        <div className="report-charts">
          <div className="chart-card">
            <h4>45문항 중 월별 L4 이상 도달 문항 수 추이</h4>
            {monthlySummary.months.length ? (
              <div className="chart-canvas">
                <canvas ref={monthlyLineRef} aria-label="45문항 중 월별 L4 이상 도달 문항 수 추이"></canvas>
              </div>
            ) : (
              <p className="muted">과거 평가 데이터가 없어 추이를 표시할 수 없습니다.</p>
            )}
          </div>
          <div className="chart-card">
            <h4>영역별 점수 추이</h4>
            {domainTrend.datasets.length ? (
              <div className="chart-canvas">
                <canvas ref={domainTrendRef} aria-label="영역별 점수 추이"></canvas>
              </div>
            ) : (
              <p className="muted">영역별 추이를 계산할 데이터가 부족합니다.</p>
            )}
          </div>
        </div>

        {/* 성장 곡선 및 예측 차트 */}
        {growthCurveData && (
          <div style={{ marginTop: '18px' }}>
            <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
              <h4>📈 성장 곡선 및 향후 추세 예측</h4>
              <div style={{ padding: '0 0 12px', fontSize: '13px', color: '#6b7280' }}>
                선형 회귀 분석을 통해 향후 3개월간의 성장 추세를 예측합니다. 점선 구간은 예측값입니다.
              </div>
              <div className="chart-canvas" style={{ height: '320px' }}>
                <canvas ref={growthCurveRef} aria-label="성장 곡선 및 예측"></canvas>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="report-section">
        <h3>핵심 결과 요약 · 시각화 · 해석</h3>
        <div className="summary-grid">
          <div>
            <h4>영역 평균 점수</h4>
            <ul>
              {domainAverages.map(entry => (
                <li key={entry.domain.name}>
                  <strong>{entry.domain.name}</strong>
                  <span>{entry.average.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>강점 영역</h4>
            <ol>
              {strengths.length ? strengths.map(entry => (
                <li key={entry.item.id}>
                  <strong>{entry.item.title}</strong>
                  <span>{entry.score}점</span>
                </li>
              )) : <li>데이터 없음</li>}
            </ol>
          </div>
          <div>
            <h4>집중 필요 영역</h4>
            <ol>
              {needs.length ? needs.map(entry => (
                <li key={entry.item.id}>
                  <strong>{entry.item.title}</strong>
                  <span>{entry.score}점</span>
                </li>
              )) : <li>데이터 없음</li>}
            </ol>
          </div>
        </div>
        <p className="muted">
          평균 점수 4 이상인 문항은 이미 일정 수준의 숙달이 이루어진 것으로 해석할 수 있으며,
          3 이하 문항은 촉구 감소·일반화·환경 확장 전략이 필요합니다. 강점 영역을 활용해 동기를 높이고,
          집중 필요 영역의 세부 기준을 수업 전략과 강화 계획으로 전환해 학습 경로를 명확히 설계하세요.
        </p>
      </section>

      <section className="report-section">
        <h3>영역별 지금 가르쳐야 할 IEP 예시 & 관련 기준</h3>
        {plans.length ? plans.map(domainPlan => (
          <article key={domainPlan.domain.name} className="iep-card">
            <header>
              <h4>{domainPlan.domain.name}</h4>
              <span className="muted">문항 {domainPlan.domain.items.length}개 중 우선 목표 1개 제시</span>
            </header>
            <ul className="iep-list">
              {domainPlan.plans.map(plan => (
                <li key={plan.item.id}>
                  <div className="iep-goal-block">
                    <strong>{plan.item.title}</strong>
                    <span className="level-tag">{plan.levelKey}</span>
                    {plan.code ? <span className="code-tag">[{plan.code}]</span> : null}
                  </div>
                  <p className="muted">현재 세부 기준: {plan.criteriaText}</p>
                  <div className="iep-goal-text">
                    <strong>추천 IEP 목표</strong>
                    <p>{plan.goal}</p>
                  </div>
                  <ProcedureToggle procedure={plan.procedure} reinforcement={plan.reinforcement} showByDefault={false} />
                  <RelatedStandardsToggle related={plan.related} showByDefault={false} />
                </li>
              ))}
            </ul>
          </article>
        )) : (
          <div className="muted">선택된 세부 기준이 없어 IEP 예시를 생성할 수 없습니다. 평가 도구에서 L1~L5 중 현재 학생 수준을 지정해주세요.</div>
        )}
      </section>

      <section className="report-section">
        <h3>월별 진행 로드맵</h3>
        {timeline.length ? (
          <div className="timeline-table">
            <div className="timeline-head">
              <span>평가 월</span>
              <span>평균 점수</span>
              <span>숙달 문항</span>
              <span>저장 일시</span>
            </div>
            {timeline.map(row => (
              <div key={row.key} className="timeline-row">
                <span>{monthKeyToLabel(row.key)}</span>
                <span>{row.average}</span>
                <span>{row.mastery}개</span>
                <span>{row.savedAt ? new Date(row.savedAt).toLocaleString("ko-KR") : "-"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">로드맵을 생성할 데이터가 없습니다.</div>
        )}
      </section>

    </div>
  );
}

function ReportTab({
  students,
  evaluations,
  lifeData,
  mappings,
  threshold,
  onThresholdChange,
  onNotify,
  iepLibrary
}) {
  const studentsWithData = students.filter(student => Object.keys(evaluations[student.id] || {}).length);
  const [selectedStudentId, setSelectedStudentId] = useState(studentsWithData[0]?.id || "");
  const reportContainerRef = useRef(null);
  const iepIndex = useMemo(() => {
    const map = {};
    // related 배열 먼저 추가 (대괄호 있는 코드와 없는 코드 모두 매핑)
    (iepLibrary?.related || []).forEach(entry => {
      map[entry.code] = entry;
      const codeWithoutBrackets = entry.code.replace(/^\[/, '').replace(/\]$/, '');
      map[codeWithoutBrackets] = entry;
    });
    // lifeskills 배열을 나중에 추가하여 덮어쓰기 (우선순위 높음)
    (iepLibrary?.lifeskills || []).forEach(entry => {
      map[entry.code] = entry;
    });
    return map;
  }, [iepLibrary]);

  useEffect(() => {
    if (!selectedStudentId && studentsWithData.length) {
      setSelectedStudentId(studentsWithData[0].id);
    }
  }, [studentsWithData, selectedStudentId]);

  const evaluationsByMonth = selectedStudentId ? evaluations[selectedStudentId] || {} : {};
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthOptions = useMemo(() => {
    const saved = sortedMonthKeys(evaluationsByMonth).reverse();
    return saved;
  }, [evaluationsByMonth]);

  useEffect(() => {
    if (monthOptions.length) {
      if (!selectedMonth || !monthOptions.includes(selectedMonth)) {
        setSelectedMonth(monthOptions[0]);
      }
    } else {
      setSelectedMonth("");
    }
  }, [monthOptions]);

  const student = students.find(s => s.id === selectedStudentId) || null;
  const evaluation = evaluationsByMonth[selectedMonth];

  const handleExportPDF = async () => {
    if (!student || !evaluation || !selectedMonth) {
      onNotify?.("보고서 데이터가 없습니다. 학생과 평가 월을 선택하세요.", "warning");
      return;
    }
    if (!reportContainerRef.current) {
      onNotify?.("보고서 영역을 찾을 수 없습니다.", "error");
      return;
    }
    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvas = await html2canvas(reportContainerRef.current, { scale: 2, backgroundColor: "#fff" });
      const pageHeightPx = Math.floor(canvas.width * (pdfHeight / pdfWidth));
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageHeightPx;
      const ctx = pageCanvas.getContext("2d");
      let yOffset = 0;
      while (yOffset < canvas.height) {
        ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, -yOffset);
        const pageData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageData, "PNG", 0, 0, pdfWidth, pdfHeight);
        yOffset += pageHeightPx;
        if (yOffset < canvas.height) pdf.addPage();
      }
      pdf.save(`GLENS_Report_${student.name}_${selectedMonth}.pdf`);
      onNotify?.("PDF로 저장했습니다.", "success");
    } catch (error) {
      console.error(error);
      onNotify?.("PDF 생성 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <section className="card report-tab">
      <div className="report-tab-header">
        <div>
          <h2>📄 결과 보고서</h2>
          <p className="muted">평가 저장이 완료된 학생만 선택할 수 있습니다. 임계값을 조정하면 관련 기준 추천이 달라집니다.</p>
        </div>
        <div className="report-controls">
          <label>
            <span>학생 선택</span>
            <select value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
              {studentsWithData.map(studentItem => (
                <option key={studentItem.id} value={studentItem.id}>{studentItem.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>평가 월</span>
            <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
              {monthOptions.map(monthKey => (
                <option key={monthKey} value={monthKey}>{monthKeyToLabel(monthKey)}</option>
              ))}
            </select>
          </label>
          <label className="threshold-control">
            <span>관련 기준 임계값</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(event) => onThresholdChange(parseFloat(event.target.value))}
            />
            <span className="threshold-value">{threshold.toFixed(2)}</span>
          </label>
          <button type="button" className="btn" onClick={handleExportPDF}>PDF 저장</button>
        </div>
      </div>

      <div ref={reportContainerRef}>
        <ReportContent
          student={student}
          monthKey={selectedMonth}
          evaluation={evaluation}
          evaluationsByMonth={evaluationsByMonth}
          lifeData={lifeData}
          mappings={mappings}
          threshold={threshold}
          iepIndex={iepIndex}
        />
      </div>
    </section>
  );
}

function SessionChart({ sessions, goalCode }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || sessions.length === 0) return;

    const ChartLib = window.Chart?.Chart || window.Chart?.default || window.Chart;
    if (typeof ChartLib !== "function") return;

    // Destroy previous chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Prepare data
    const labels = sortedSessions.map((s, i) => `세션 ${s.sessionNumber || i + 1}`);
    const correctRates = sortedSessions.map(s => {
      const trial = parseInt(s.trialCount) || 0;
      const correct = parseInt(s.correctCount) || 0;
      return trial > 0 ? (correct / trial * 100) : 0;
    });

    const resultColors = sortedSessions.map(s => {
      if (s.result === 'success') return 'rgba(16, 185, 129, 0.8)';
      if (s.result === 'partial') return 'rgba(251, 191, 36, 0.8)';
      return 'rgba(239, 68, 68, 0.8)';
    });

    try {
      chartInstanceRef.current = new ChartLib(chartRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: "정반응률 (%)",
            data: correctRates,
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: resultColors,
            pointBorderColor: resultColors,
            pointBorderWidth: 2,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: '정반응률 (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: '세션'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                afterLabel: function(context) {
                  const session = sortedSessions[context.dataIndex];
                  return [
                    `날짜: ${new Date(session.date).toLocaleDateString("ko-KR")}`,
                    `시도: ${session.trialCount || '-'} / 정반응: ${session.correctCount || '-'}`,
                    `결과: ${session.result === 'success' ? '성공' : session.result === 'partial' ? '부분' : '실패'}`
                  ];
                }
              }
            },
            datalabels: { display: false }
          }
        }
      });
    } catch (error) {
      console.error("Chart creation error:", error);
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [sessions, goalCode]);

  if (sessions.length === 0) return null;

  return (
    <div style={{ marginTop: '16px', marginBottom: '16px', background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
        📊 세션별 진행 추이
      </h5>
      <div style={{ height: '280px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

function IEPDataSheetSection({ studentId, activeGoals }) {
  const [sessions, setSessions] = useState(() => {
    const stored = localStorage.getItem(`iep_sessions_${studentId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [sessionForm, setSessionForm] = useState({
    goalCode: "",
    date: new Date().toISOString().split("T")[0],
    sessionNumber: "",
    activity: "",
    promptLevel: "independent",
    trialCount: "",
    correctCount: "",
    result: "success",
    notes: ""
  });

  const [showForm, setShowForm] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  useEffect(() => {
    localStorage.setItem(`iep_sessions_${studentId}`, JSON.stringify(sessions));
  }, [sessions, studentId]);

  const handleAddSession = () => {
    if (!sessionForm.goalCode || !sessionForm.date) {
      alert("목표와 날짜를 선택해주세요.");
      return;
    }

    if (editingSessionId) {
      // Update existing session
      setSessions(sessions.map(s =>
        s.id === editingSessionId
          ? { ...sessionForm, id: editingSessionId, createdAt: s.createdAt, updatedAt: new Date().toISOString() }
          : s
      ));
      setEditingSessionId(null);
    } else {
      // Add new session
      const newSession = {
        id: Date.now().toString(),
        ...sessionForm,
        createdAt: new Date().toISOString()
      };
      setSessions([...sessions, newSession]);
    }

    setSessionForm({
      goalCode: sessionForm.goalCode, // Keep the same goal selected
      date: new Date().toISOString().split("T")[0],
      sessionNumber: "",
      activity: "",
      promptLevel: "independent",
      trialCount: "",
      correctCount: "",
      result: "success",
      notes: ""
    });
    setShowForm(false);
  };

  const handleEditSession = (session) => {
    setSessionForm({
      goalCode: session.goalCode,
      date: session.date,
      sessionNumber: session.sessionNumber,
      activity: session.activity,
      promptLevel: session.promptLevel,
      trialCount: session.trialCount,
      correctCount: session.correctCount,
      result: session.result,
      notes: session.notes
    });
    setEditingSessionId(session.id);
    setShowForm(true);
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm("이 세션 기록을 삭제하시겠습니까?")) {
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };

  const getGoalTitle = (goalCode) => {
    const goal = activeGoals.find(g => g.code === goalCode);
    return goal ? goal.summary : goalCode;
  };

  const sessionsByGoal = useMemo(() => {
    const grouped = {};
    sessions.forEach(session => {
      if (!grouped[session.goalCode]) {
        grouped[session.goalCode] = [];
      }
      grouped[session.goalCode].push(session);
    });
    return grouped;
  }, [sessions]);

  const promptLevelOptions = [
    { value: "independent", label: "독립 (Independent)" },
    { value: "verbal", label: "언어적 촉구 (Verbal)" },
    { value: "gestural", label: "제스처 촉구 (Gestural)" },
    { value: "model", label: "모델링 (Model)" },
    { value: "physical", label: "신체적 도움 (Physical)" }
  ];

  return (
    <section className="report-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3>📋 IEP 실행 데이터 시트</h3>
        <button
          type="button"
          className="pill"
          onClick={() => setShowForm(!showForm)}
          style={{ fontSize: '14px' }}
        >
          {showForm ? "폼 닫기" : "+ 세션 기록 추가"}
        </button>
      </div>
      <p className="muted">진행중인 IEP 목표의 세션별 실행 데이터를 기록하고 추적합니다.</p>

      {activeGoals.length === 0 && (
        <p className="muted" style={{ marginTop: '12px' }}>진행중인 목표가 없습니다. 목표를 먼저 할당해주세요.</p>
      )}

      {showForm && activeGoals.length > 0 && (
        <div style={{
          background: '#f9fafb',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>{editingSessionId ? '세션 기록 수정' : '세션 기록 추가'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>목표 선택 *</span>
              <select
                value={sessionForm.goalCode}
                onChange={(e) => setSessionForm({ ...sessionForm, goalCode: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              >
                <option value="">선택하세요</option>
                {activeGoals.map(goal => (
                  <option key={goal.code} value={goal.code}>
                    [{goal.code}] {goal.summary.substring(0, 40)}...
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>날짜 *</span>
              <input
                type="date"
                value={sessionForm.date}
                onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>세션 번호</span>
              <input
                type="text"
                placeholder="예: 1, 2, 3..."
                value={sessionForm.sessionNumber}
                onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>촉구 수준</span>
              <select
                value={sessionForm.promptLevel}
                onChange={(e) => setSessionForm({ ...sessionForm, promptLevel: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              >
                {promptLevelOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>시도 횟수</span>
              <input
                type="number"
                min="0"
                placeholder="5"
                value={sessionForm.trialCount}
                onChange={(e) => setSessionForm({ ...sessionForm, trialCount: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>정반응 횟수</span>
              <input
                type="number"
                min="0"
                placeholder="4"
                value={sessionForm.correctCount}
                onChange={(e) => setSessionForm({ ...sessionForm, correctCount: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>활동/변별자극</span>
              <input
                type="text"
                placeholder="예: 급식 전 손씻기"
                value={sessionForm.activity}
                onChange={(e) => setSessionForm({ ...sessionForm, activity: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: '500' }}>결과</span>
              <select
                value={sessionForm.result}
                onChange={(e) => setSessionForm({ ...sessionForm, result: e.target.value })}
                style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
              >
                <option value="success">성공</option>
                <option value="partial">부분 성공</option>
                <option value="failure">실패</option>
              </select>
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>관찰 메모</span>
            <textarea
              placeholder="세션 중 관찰한 내용, 특이사항 등을 기록하세요"
              value={sessionForm.notes}
              onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
              rows="3"
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              className="pill success"
              onClick={handleAddSession}
              style={{ fontSize: '14px' }}
            >
              {editingSessionId ? '수정 저장' : '기록 저장'}
            </button>
            <button
              type="button"
              className="pill"
              onClick={() => {
                setShowForm(false);
                setEditingSessionId(null);
                setSessionForm({
                  goalCode: "",
                  date: new Date().toISOString().split("T")[0],
                  sessionNumber: "",
                  activity: "",
                  promptLevel: "independent",
                  trialCount: "",
                  correctCount: "",
                  result: "success",
                  notes: ""
                });
              }}
              style={{ fontSize: '14px' }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {sessions.length > 0 ? (
        <div style={{ marginTop: '16px' }}>
          {activeGoals.map(goal => {
            const goalSessions = sessionsByGoal[goal.code] || [];
            if (goalSessions.length === 0) return null;

            const sortedSessions = [...goalSessions].sort((a, b) => new Date(b.date) - new Date(a.date));
            const successRate = goalSessions.length > 0
              ? (goalSessions.filter(s => s.result === "success").length / goalSessions.length * 100).toFixed(1)
              : "0";

            return (
              <div key={goal.code} style={{ marginBottom: '24px' }}>
                <div style={{
                  background: '#f3f4f6',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ fontSize: '15px' }}>[{goal.code}] {goal.summary}</strong>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                      총 {goalSessions.length}회 세션 · 성공률 {successRate}%
                    </div>
                  </div>
                </div>

                <SessionChart sessions={goalSessions} goalCode={goal.code} />

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    background: 'white',
                    border: '1px solid #e5e7eb'
                  }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>날짜</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>세션</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>활동</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>촉구 수준</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>시도</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>정반응</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>결과</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>메모</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: '600' }}>작업</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSessions.map(session => (
                        <tr key={session.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '8px' }}>{new Date(session.date).toLocaleDateString("ko-KR")}</td>
                          <td style={{ padding: '8px' }}>{session.sessionNumber || "-"}</td>
                          <td style={{ padding: '8px' }}>{session.activity || "-"}</td>
                          <td style={{ padding: '8px' }}>
                            {promptLevelOptions.find(opt => opt.value === session.promptLevel)?.label || session.promptLevel}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{session.trialCount || "-"}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{session.correctCount || "-"}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              background: session.result === "success" ? "#d1fae5" : session.result === "partial" ? "#fef3c7" : "#fee2e2",
                              color: session.result === "success" ? "#065f46" : session.result === "partial" ? "#92400e" : "#991b1b"
                            }}>
                              {session.result === "success" ? "성공" : session.result === "partial" ? "부분" : "실패"}
                            </span>
                          </td>
                          <td style={{ padding: '8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {session.notes || "-"}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleEditSession(session)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  border: '1px solid #e5e7eb',
                                  background: 'white',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#2563eb'
                                }}
                              >
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSession(session.id)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  border: '1px solid #e5e7eb',
                                  background: 'white',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#dc2626'
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="muted" style={{ marginTop: '16px' }}>아직 기록된 세션이 없습니다.</p>
      )}
    </section>
  );
}

function DashboardTab({
  students,
  evaluations,
  lifeData,
  mappings,
  threshold,
  onThresholdChange,
  iepLibrary,
  studentGoals,
  onAssignGoal,
  onUpdateGoalStatus,
  onRemoveGoal
}) {
  const [activeStudentId, setActiveStudentId] = useState(students[0]?.id || "");
  const iepIndex = useMemo(() => {
    const map = {};
    // related 배열 먼저 추가 (대괄호 있는 코드와 없는 코드 모두 매핑)
    (iepLibrary?.related || []).forEach(entry => {
      map[entry.code] = entry;
      const codeWithoutBrackets = entry.code.replace(/^\[/, '').replace(/\]$/, '');
      map[codeWithoutBrackets] = entry;
    });
    // lifeskills 배열을 나중에 추가하여 덮어쓰기 (우선순위 높음)
    (iepLibrary?.lifeskills || []).forEach(entry => {
      map[entry.code] = entry;
    });
    return map;
  }, [iepLibrary]);
  const goalState = useMemo(() => (
    studentGoals?.[activeStudentId] || { active: [], completed: [], hold: [] }
  ), [studentGoals, activeStudentId]);
  const usedCodes = useMemo(() => new Set([
    ...goalState.active.map(g => g.code),
    ...goalState.completed.map(g => g.code),
    ...goalState.hold.map(g => g.code)
  ]), [goalState]);
  const availableGoals = useMemo(() => (
    (iepLibrary?.lifeskills || []).
      map(entry => ({
        ...entry,
        domain: entry.domain || "LifeSkills",
        title: lifeData?.itemMap?.[entry.itemId]?.title || entry.goal
      })).
      filter(entry => !usedCodes.has(entry.code))
  ), [iepLibrary, usedCodes, lifeData]);
  const curriculumOptions = useMemo(() => {
    const set = new Set(["ALL"]);
    availableGoals.forEach(goal => set.add(goal.domain || "LifeSkills"));
    return Array.from(set);
  }, [availableGoals]);
  const [curriculumFilter, setCurriculumFilter] = useState("ALL");
  useEffect(() => {
    if (!curriculumOptions.includes(curriculumFilter)) {
      setCurriculumFilter("ALL");
    }
  }, [curriculumOptions, curriculumFilter]);
  const assignableGoals = useMemo(() => (
    availableGoals
      .filter(goal => curriculumFilter === "ALL" || goal.domain === curriculumFilter)
      .slice(0, 8)
      .map(goal => ({
        code: goal.code,
        title: goal.title,
        domain: goal.domain,
        summary: goal.goal,
        detail: goal.procedure ? `수업 전략: ${goal.procedure}` : "",
        reinforcement: goal.reinforcement,
        related_goals: goal.related_goals || []
      }))
  ), [availableGoals, curriculumFilter]);
  const activeGoals = goalState.active;
  const completedGoals = goalState.completed;
  const holdGoals = goalState.hold;
  const totalGoals = activeGoals.length + completedGoals.length + holdGoals.length;

  useEffect(() => {
    if (!activeStudentId && students.length) {
      setActiveStudentId(students[0].id);
    }
  }, [students, activeStudentId]);

  const student = students.find(s => s.id === activeStudentId) || null;
  const evaluationsByMonth = student ? evaluations[student.id] || {} : {};
  const months = sortedMonthKeys(evaluationsByMonth);
  const latestMonth = months.slice(-1)[0] || "";
  const [selectedMonth, setSelectedMonth] = useState(latestMonth);

  useEffect(() => {
    const latest = months.slice(-1)[0];
    if (latest && selectedMonth !== latest) {
      setSelectedMonth(latest);
    }
    if (!months.length) setSelectedMonth("");
  }, [months]);

  const evaluation = evaluationsByMonth[selectedMonth];
  const domainBarRef = useRef(null);
  const itemBarRef = useRef(null);
  const itemBarTopRef = useRef(null);
  const levelDistRef = useRef(null);
  const monthlyLineRef = useRef(null);
  const domainTrendRef = useRef(null);
  const growthCurveRef = useRef(null);
  const chartInstancesRef = useRef({
    domainBar: null,
    itemBar: null,
    itemBarTop: null,
    levelDist: null,
    monthlyLine: null,
    domainTrend: null,
    growthCurve: null
  });

  const domainAverages = useMemo(() => computeDomainAverages(evaluation, lifeData), [evaluation, lifeData]);
  const { strengths, needs } = useMemo(() => findStrengthsAndNeeds(evaluation, lifeData), [evaluation, lifeData]);
  const allItemScoresDB = useMemo(() => computeItemScores(evaluation, lifeData), [evaluation, lifeData]);
  const itemScoresBottom = useMemo(() => {
    return [...allItemScoresDB].sort((a, b) => a.score - b.score).slice(0, 10);
  }, [allItemScoresDB]);
  const itemScoresTop = useMemo(() => {
    return [...allItemScoresDB].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [allItemScoresDB]);
  const domainColorMap = useMemo(() => {
    const map = {};
    (lifeData?.domains || []).forEach((domain, idx) => {
      map[domain.name] = getColor(idx, 0.75);
    });
    return map;
  }, [lifeData]);
  const levelDistribution = useMemo(() => {
    if (!evaluation || !lifeData) return null;
    const levels = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0 };
    Object.entries(evaluation.levels || {}).forEach(([itemId, level]) => {
      if (levels.hasOwnProperty(level)) {
        levels[level]++;
      }
    });
    return levels;
  }, [evaluation, lifeData]);
  const monthlySummary = useMemo(() => computeMonthlySummary(evaluationsByMonth), [evaluationsByMonth]);
  const domainTrend = useMemo(() => computeDomainTrend(evaluationsByMonth, lifeData), [evaluationsByMonth, lifeData]);
  const growthCurveData = useMemo(() => {
    const monthKeys = Object.keys(evaluationsByMonth).sort();
    if (monthKeys.length < 2) return null;

    // 도메인별 월별 평균 점수 계산
    const domainData = (lifeData?.domains || []).map(domain => {
      const scores = monthKeys.map(mk => {
        const evalData = evaluationsByMonth[mk];
        const domainItems = domain.items || [];
        const domainScores = domainItems
          .map(item => evalData?.responses?.[item.id || `item_${item.number}`])
          .filter(score => score !== undefined);
        return domainScores.length > 0
          ? domainScores.reduce((a, b) => a + b, 0) / domainScores.length
          : null;
      });
      return { domain: domain.name, scores };
    });

    // 선형 회귀로 추세선 및 예측 계산
    const predict = (scores) => {
      const validPoints = scores.map((s, i) => ({ x: i, y: s })).filter(p => p.y !== null);
      if (validPoints.length < 2) return [];

      const n = validPoints.length;
      const sumX = validPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = validPoints.reduce((sum, p) => sum + p.y, 0);
      const sumXY = validPoints.reduce((sum, p) => sum + p.x * p.y, 0);
      const sumX2 = validPoints.reduce((sum, p) => sum + p.x * p.x, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // 현재 + 미래 3개월 예측
      const predictions = [];
      for (let i = 0; i < scores.length + 3; i++) {
        predictions.push(Math.max(0, Math.min(5, intercept + slope * i)));
      }
      return predictions;
    };

    return {
      months: [...monthKeys, ...['예측1', '예측2', '예측3']],
      domainData: domainData.map(dd => ({
        ...dd,
        predictions: predict(dd.scores)
      }))
    };
  }, [evaluationsByMonth, lifeData]);
  const plans = useMemo(() => extractIEPPlans(evaluation, lifeData, mappings, threshold, student?.name || "학생", iepIndex), [evaluation, lifeData, mappings, threshold, student, iepIndex]);
  const usedCodesDB = useMemo(() => new Set([
    ...goalState.active.map(g => g.code),
    ...goalState.completed.map(g => g.code),
    ...goalState.hold.map(g => g.code)
  ]), [goalState]);
  const recommendedGoals = useMemo(() => {
    const seen = new Set();
    return plans.flatMap(domainPlan => domainPlan.plans.map(plan => ({
      ...plan,
      domain: domainPlan.domain.name
    }))).filter(plan => {
      if (seen.has(plan.code)) return false;
      if (usedCodesDB.has(plan.code)) return false; // 이미 등록된 목표 제외
      seen.add(plan.code);
      return true;
    });
  }, [plans, usedCodesDB]);
  const timeline = useMemo(() => buildTimelineRows(evaluationsByMonth), [evaluationsByMonth]);

  useEffect(() => {
    const instances = chartInstancesRef.current;
    Object.keys(instances).forEach(key => {
      if (instances[key]) {
        instances[key].destroy();
        instances[key] = null;
      }
    });

    if (!evaluation) return;
    if (typeof window === "undefined") return;
    const ChartGlobal = window.Chart?.Chart || window.Chart?.default || window.Chart;
    if (typeof ChartGlobal !== "function") {
      console.warn("Chart.js 라이브러리를 찾을 수 없어 대시보드 그래프를 생략합니다.");
      return;
    }

    const safeCreate = (fn) => {
      try {
        return fn();
      } catch (error) {
        console.error("차트 렌더링 오류:", error);
        return null;
      }
    };

    if (domainBarRef.current && domainAverages.length) {
      instances.domainBar = safeCreate(() => new ChartGlobal(domainBarRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: domainAverages.map(entry => entry.domain.name),
          datasets: [{
            label: "평균 점수",
            data: domainAverages.map(entry => entry.average),
            backgroundColor: domainAverages.map((_, idx) => getColor(idx, 0.75)),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 11 },
              color: '#374151'
            }
          }
        }
      }));
    }

    if (itemBarRef.current && itemScoresBottom.length) {
      instances.itemBar = safeCreate(() => new ChartGlobal(itemBarRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: itemScoresBottom.map(entry => `${entry.label} (${entry.domain})`),
          datasets: [{
            label: "점수",
            data: itemScoresBottom.map(entry => entry.score),
            backgroundColor: itemScoresBottom.map(entry => domainColorMap[entry.domain] || getColor(7, 0.75))
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 10 },
              color: '#374151'
            }
          }
        }
      }));
    }

    if (itemBarTopRef.current && itemScoresTop.length) {
      instances.itemBarTop = safeCreate(() => new ChartGlobal(itemBarTopRef.current.getContext("2d"), {
        type: "bar",
        data: {
          labels: itemScoresTop.map(entry => `${entry.label} (${entry.domain})`),
          datasets: [{
            label: "점수",
            data: itemScoresTop.map(entry => entry.score),
            backgroundColor: itemScoresTop.map(entry => domainColorMap[entry.domain] || getColor(0, 0.75))
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { display: false },
            datalabels: {
              anchor: 'end',
              align: 'right',
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 10 },
              color: '#374151'
            }
          }
        }
      }));
    }

    if (levelDistRef.current && levelDistribution) {
      instances.levelDist = safeCreate(() => new ChartGlobal(levelDistRef.current.getContext("2d"), {
        type: "doughnut",
        data: {
          labels: ['L1 (기초)', 'L2 (신체촉구)', 'L3 (언어촉구)', 'L4 (부분독립)', 'L5 (완전독립)'],
          datasets: [{
            label: "문항 수",
            data: [levelDistribution.L1, levelDistribution.L2, levelDistribution.L3, levelDistribution.L4, levelDistribution.L5],
            backgroundColor: [
              getColor(7, 0.75), // L1 - 빨강
              getColor(6, 0.75), // L2 - 주황
              getColor(4, 0.75), // L3 - 노랑
              getColor(2, 0.75), // L4 - 연두
              getColor(0, 0.75)  // L5 - 초록
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right" },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed}개 (${percentage}%)`;
                }
              }
            },
            datalabels: {
              formatter: (value) => value > 0 ? value : '',
              color: '#fff',
              font: { weight: 'bold', size: 14 }
            }
          }
        }
      }));
    }

    if (monthlyLineRef.current && monthlySummary.months.length) {
      instances.monthlyLine = safeCreate(() => new ChartGlobal(monthlyLineRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: monthlySummary.months,
          datasets: [
            {
              label: "L4 이상 도달",
              data: monthlySummary.l4l5Counts.map(d => d.total),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              tension: 0.3,
              pointRadius: 5,
              pointBackgroundColor: '#10b981',
              fill: true,
              datalabels: {
                align: 'top',
                anchor: 'end',
                offset: 4,
                formatter: (value) => value > 0 ? value + '개' : '',
                font: { weight: 'bold', size: 11 },
                color: '#065f46',
                backgroundColor: 'rgba(209, 250, 229, 0.9)',
                borderRadius: 3,
                padding: 3
              }
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 45,
              ticks: {
                stepSize: 5
              },
              title: {
                display: true,
                text: '문항 수',
                font: { size: 12, weight: 'bold' }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + '개';
                }
              }
            }
          }
        }
      }));
    }

    if (domainTrendRef.current && domainTrend.datasets.length) {
      instances.domainTrend = safeCreate(() => new ChartGlobal(domainTrendRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: domainTrend.months,
          datasets: domainTrend.datasets.map((dataset, idx) => ({
            ...dataset,
            borderColor: getColor(idx, 0.85),
            backgroundColor: getColor(idx, 0.12),
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: getColor(idx, 1),
            datalabels: {
              align: 'top',
              anchor: 'end',
              offset: 2,
              formatter: (value) => value.toFixed(1),
              font: { weight: 'bold', size: 9 },
              color: '#1f2937',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 2,
              padding: 1
            }
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true, max: 5 } },
          plugins: {
            legend: { position: "bottom" }
          }
        }
      }));
    }

    if (growthCurveRef.current && growthCurveData) {
      const actualDataLength = growthCurveData.domainData[0]?.scores.length || 0;
      instances.growthCurve = safeCreate(() => new ChartGlobal(growthCurveRef.current.getContext("2d"), {
        type: "line",
        data: {
          labels: growthCurveData.months.map((m, i) =>
            i >= growthCurveData.months.length - 3 ? m : monthKeyToLabel(m)
          ),
          datasets: growthCurveData.domainData.map((dd, idx) => {
            const scoresLength = dd.scores.length;
            return {
              label: dd.domain,
              data: dd.predictions,
              borderColor: getColor(idx, 0.85),
              backgroundColor: getColor(idx, 0.12),
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: getColor(idx, 1),
              segment: {
                borderDash: (ctx) => {
                  // 예측 부분은 점선으로
                  return ctx.p0DataIndex >= scoresLength - 1 ? [5, 5] : [];
                }
              }
            };
          })
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 5, title: { display: true, text: '평균 점수' } },
            x: { title: { display: true, text: '평가 시점' } }
          },
          plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: '📈 성장 곡선 및 추세 예측', font: { size: 16 } },
            datalabels: { display: false }
          }
        }
      }));
    }

    return () => {
      Object.keys(instances).forEach(key => {
        if (instances[key]) {
          instances[key].destroy();
          instances[key] = null;
        }
      });
    };
  }, [evaluation, domainAverages, itemScoresBottom, itemScoresTop, levelDistribution, monthlySummary, domainTrend, growthCurveData]);

  return (
    <section className="card dashboard">
      <div className="dashboard-header">
        <div>
          <h2>📊 학생별 대시보드</h2>
          <p className="muted">학생 목록을 가로로 확인하고, 평가 저장 후 최신 리포트를 즉시 검토하세요.</p>
        </div>
        <div className="dashboard-tabs">
          <label className="threshold-control">
            <span>임계값</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(event) => onThresholdChange(parseFloat(event.target.value))}
            />
            <span className="threshold-value">{threshold.toFixed(2)}</span>
          </label>
        </div>
      </div>

      <div className="student-carousel">
        {students.map(studentItem => (
          <button
            key={studentItem.id}
            type="button"
            className={`student-chip${activeStudentId === studentItem.id ? " active" : ""}`}
            onClick={() => setActiveStudentId(studentItem.id)}
          >
            {studentItem.name}
          </button>
        ))}
      </div>

      {student ? (
        <div className="dashboard-body">
          <div className="dashboard-meta">
            <label>
              <span>평가 월</span>
              <select value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
                {months.map(monthKey => (
                  <option key={monthKey} value={monthKey}>{monthKeyToLabel(monthKey)}</option>
                ))}
              </select>
            </label>
            <div className="summary-pill">
              <span>총 평가 회차</span>
              <strong>{months.length}</strong>
            </div>
            <div className="summary-pill">
              <span>최근 평가</span>
              <strong>{months.length ? monthKeyToLabel(months.slice(-1)[0]) : "-"}</strong>
            </div>
          </div>

          <section className="benchmark-panel">
            <div className="benchmark-header">
              <div>
                <h3>📌 최신 벤치마크 기반 업그레이드 제안</h3>
                <p className="muted">ABA·PBIS·특수교육·EFL·VB-MAPP·TEACCH·에듀테크 트렌드를 반영한 핵심 모듈입니다.</p>
              </div>
              <div className="benchmark-legend">
                <span className="benchmark-pill">프로그램 흐름</span>
                <span className="benchmark-pill">데이터 시각화</span>
                <span className="benchmark-pill">AI 코스웨어</span>
              </div>
            </div>
            <div className="benchmark-grid">
              {BENCHMARK_INSIGHTS.map((insight) => (
                <article key={insight.title} className="benchmark-card">
                  <h4>{insight.title}</h4>
                  <p className="muted">{insight.description}</p>
                  <div className="benchmark-tags">
                    {insight.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <ul>
                    {insight.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="benchmark-actions">
              <div>
                <strong>다음 단계</strong>
                <p className="muted">우선순위 설정 후, 모듈별 MVP 화면과 데이터 연결을 순차 적용하세요.</p>
              </div>
              <ul>
                <li>행동 데이터 캡처 폼 + 모바일 뷰 추가</li>
                <li>IEP 목표-활동 자동 매핑 리포트 생성</li>
                <li>가족용 요약 리포트 PDF 템플릿 개선</li>
              </ul>
            </div>
          </section>

          <div className="stat-grid">
            <div className="stat-card">
              <span>현재 평균 점수</span>
              <strong>{domainAverages.length ? (domainAverages.reduce((sum, entry) => sum + entry.average, 0) / domainAverages.length).toFixed(2) : "-"}</strong>
              <small>{monthKeyToLabel(selectedMonth)} 기준</small>
            </div>
            <div className="stat-card">
              <span>강점 문항</span>
              <strong>{strengths.length}</strong>
              <small>Top 3 문항</small>
            </div>
            <div className="stat-card">
              <span>집중 필요 문항</span>
              <strong>{needs.length}</strong>
              <small>지원이 필요한 항목</small>
            </div>
            <div className="stat-card">
              <span>배정된 목표</span>
              <strong>{totalGoals}</strong>
              <small>진행 {goalState.active.length} · 완료 {goalState.completed.length} · 보류 {goalState.hold.length}</small>
            </div>
          </div>

          <div className="report-charts">
            <div className="chart-card">
              <h4>영역별 평균 점수</h4>
              {domainAverages.length ? (
                <div className="chart-canvas">
                  <canvas ref={domainBarRef}></canvas>
                </div>
              ) : (
                <p className="muted">데이터 없음</p>
              )}
            </div>
            <div className="chart-card">
              <h4>문항별 점수 (상위 10개)</h4>
              {itemScoresTop.length ? (
                <div className="chart-canvas">
                  <canvas ref={itemBarTopRef}></canvas>
                </div>
              ) : (
                <p className="muted">데이터 없음</p>
              )}
            </div>
          </div>
          <div className="report-charts">
            <div className="chart-card">
              <h4>문항별 점수 (하위 10개)</h4>
              {itemScoresBottom.length ? (
                <div className="chart-canvas">
                  <canvas ref={itemBarRef}></canvas>
                </div>
              ) : (
                <p className="muted">데이터 없음</p>
              )}
            </div>
            <div className="chart-card">
              <h4>수준별 문항 분포</h4>
              {levelDistribution ? (
                <div className="chart-canvas">
                  <canvas ref={levelDistRef}></canvas>
                </div>
              ) : (
                <p className="muted">데이터 없음</p>
              )}
            </div>
          </div>
          <div className="report-charts">
            <div className="chart-card">
              <h4>45문항 중 월별 L4 이상 도달 문항 수 추이</h4>
              {monthlySummary.months.length ? (
                <div className="chart-canvas">
                  <canvas ref={monthlyLineRef}></canvas>
                </div>
              ) : (
                <p className="muted">추이를 표시할 데이터가 없습니다.</p>
              )}
            </div>
            <div className="chart-card">
              <h4>영역별 점수 추이</h4>
              {domainTrend.datasets.length ? (
                <div className="chart-canvas">
                  <canvas ref={domainTrendRef}></canvas>
                </div>
              ) : (
                <p className="muted">추이를 표시할 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          {/* 성장 곡선 및 예측 차트 */}
          {growthCurveData && (
            <div style={{ marginTop: '18px' }}>
              <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
                <h4>📈 성장 곡선 및 향후 추세 예측</h4>
                <div style={{ padding: '0 0 12px', fontSize: '13px', color: '#6b7280' }}>
                  선형 회귀 분석을 통해 향후 3개월간의 성장 추세를 예측합니다. 점선 구간은 예측값입니다.
                </div>
                <div className="chart-canvas" style={{ height: '320px' }}>
                  <canvas ref={growthCurveRef}></canvas>
                </div>
              </div>
            </div>
          )}

          <section className="goal-section">
            <div className="goal-column">
              <h3>추천 IEP 목표</h3>
              <ul className="goal-list">
                {recommendedGoals.length ? recommendedGoals.map(plan => (
                  <li key={`${plan.code}-${plan.levelKey}`} className="goal-item">
                    <div className="goal-item-head">
                      <div>
                        <strong>{plan.item.title}</strong>
                        <span className="code-tag">[{plan.code}]</span>
                        <span className="badge">{plan.domain}</span>
                      </div>
                      <div className="goal-actions">
                        <button type="button" className="pill" onClick={() => onAssignGoal(student.id, {
                          code: plan.code,
                          summary: plan.goal,
                          detail: plan.procedure,
                          reinforcement: plan.reinforcement,
                          curriculum: "LifeSkills",
                          area: plan.domain
                        })}>진행 등록</button>
                      </div>
                    </div>
                    <p className="muted">세부 기준: {plan.criteriaText}</p>
                    <div className="iep-goal-text">
                      <strong>추천 IEP 목표</strong>
                      <p>{plan.goal}</p>
                    </div>
                    <RelatedStandardsToggle
                      related={(plan.related_goals || plan.related || []).map(rg => ({
                        domain: rg.curriculum || rg.area || rg.domain,
                        code: rg.code,
                        text: rg.text,
                        similarity: rg.similarity,
                        matched_terms: rg.matched_terms || []
                      }))}
                      showByDefault={false}
                    />
                  </li>
                )) : <li className="muted">추천할 목표가 없습니다.</li>}
              </ul>
            </div>
            <div className="goal-column">
              <h3>새 IEP 목표 등록</h3>
              <div className="assign-controls">
                <label>
                  <span>커리큘럼</span>
                  <select value={curriculumFilter} onChange={(event) => setCurriculumFilter(event.target.value)}>
                    {curriculumOptions.map(option => (
                      <option key={option} value={option}>{option === "ALL" ? "전체" : option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <ul className="goal-list">
                {assignableGoals.length ? assignableGoals.map(goal => (
                  <li key={goal.code} className="goal-item">
                    <div className="goal-item-head">
                      <div>
                        <strong>{goal.title}</strong>
                        <span className="code-tag">[{goal.code}]</span>
                        <span className="badge">{goal.domain}</span>
                      </div>
                      <div className="goal-actions">
                        <button type="button" className="pill" onClick={() => onAssignGoal(student.id, {
                          code: goal.code,
                          summary: goal.summary,
                          detail: goal.detail,
                          reinforcement: goal.reinforcement,
                          curriculum: "LifeSkills",
                          area: goal.domain
                        })}>진행 등록</button>
                      </div>
                    </div>
                    <div className="iep-goal-text">
                      <strong>IEP 목표</strong>
                      <p>{goal.summary}</p>
                    </div>
                    <RelatedStandardsToggle
                      related={(goal.related_goals || []).map(rg => ({
                        domain: rg.curriculum || rg.area,
                        code: rg.code,
                        text: rg.text,
                        similarity: rg.similarity,
                        matched_terms: rg.matched_terms || []
                      }))}
                      showByDefault={false}
                    />
                  </li>
                )) : <li className="muted">할당 가능한 목표가 없습니다.</li>}
              </ul>
            </div>
          </section>

          <section className="goal-section" style={{ display: 'block' }}>
            <div style={{ marginBottom: '24px' }}>
              <h3>진행중인 목표</h3>
              <ul className="goal-list">
                {activeGoals.length ? activeGoals.map(goal => (
                  <li key={`${goal.code}-active`} className="goal-item">
                    <div className="goal-item-head">
                      <div>
                        <strong style={{ fontSize: '20px' }}>{goal.summary}</strong>
                        <span className="code-tag">[{goal.code}]</span>
                      </div>
                      <div className="goal-actions">
                        <button type="button" className="pill success" onClick={() => onUpdateGoalStatus(student.id, goal.code, "completed")}>완료</button>
                        <button type="button" className="pill warning" onClick={() => onUpdateGoalStatus(student.id, goal.code, "hold")}>보류</button>
                        <button type="button" className="pill danger" onClick={() => onRemoveGoal(student.id, goal.code)}>삭제</button>
                      </div>
                    </div>
                    {goal.detail || goal.reinforcement ? (
                      <ProcedureToggle procedure={goal.detail} reinforcement={goal.reinforcement} showByDefault={false} />
                    ) : null}
                  </li>
                )) : <li className="muted">진행중인 목표가 없습니다.</li>}
              </ul>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <h3>보류된 목표</h3>
                <ul className="goal-list">
                  {holdGoals.length ? holdGoals.map(goal => (
                    <li key={`${goal.code}-hold`} className="goal-item">
                      <div className="goal-item-head">
                        <div>
                          <strong style={{ fontSize: '20px' }}>{goal.summary}</strong>
                          <span className="code-tag">[{goal.code}]</span>
                        </div>
                        <div className="goal-actions">
                          <button type="button" className="pill" onClick={() => onUpdateGoalStatus(student.id, goal.code, "active")}>재개</button>
                        </div>
                      </div>
                    </li>
                  )) : <li className="muted">보류된 목표가 없습니다.</li>}
                </ul>
              </div>
              <div>
                <h3>완료된 목표</h3>
                <ul className="goal-list">
                  {completedGoals.length ? completedGoals.map(goal => (
                    <li key={`${goal.code}-completed`} className="goal-item">
                      <div className="goal-item-head">
                        <div>
                          <strong style={{ fontSize: '20px' }}>{goal.summary}</strong>
                          <span className="code-tag">[{goal.code}]</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <small className="muted">완료일: {goal.completedAt ? new Date(goal.completedAt).toLocaleDateString("ko-KR") : "-"}</small>
                          <button type="button" className="pill warning" onClick={() => onUpdateGoalStatus(student.id, goal.code, "active")}>취소</button>
                        </div>
                      </div>
                    </li>
                  )) : <li className="muted">완료된 목표가 없습니다.</li>}
                </ul>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="muted">학생 등록 후 평가를 저장하면 대시보드에서 확인할 수 있습니다.</div>
      )}

      {student && evaluation ? (
        <div className="dashboard-extra">
          <section className="report-section">
            <h3>월별 진행 로드맵</h3>
            {timeline.length ? (
              <div className="timeline-table">
                <div className="timeline-head">
                  <span>평가 월</span>
                  <span>평균 점수</span>
                  <span>숙달 문항</span>
                  <span>저장 일시</span>
                </div>
                {timeline.map(row => (
                  <div key={row.key} className="timeline-row">
                    <span>{monthKeyToLabel(row.key)}</span>
                    <span>{row.average}</span>
                    <span>{row.mastery}개</span>
                    <span>{row.savedAt ? new Date(row.savedAt).toLocaleString("ko-KR") : "-"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">로드맵을 생성할 데이터가 없습니다.</p>
            )}
          </section>

          <IEPDataSheetSection
            studentId={student.id}
            activeGoals={activeGoals}
          />
        </div>
      ) : null}
    </section>
  );
}

function GoalLibraryRow({ goal }) {
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);
  const [isRelatedOpen, setIsRelatedOpen] = useState(false);
  const hasDetail = goal.detail || goal.reinforcement;
  const hasRelated = goal.related_goals && goal.related_goals.length > 0;

  const simBadge = (sim) => {
    if (sim >= 0.3) return '🟢';
    if (sim >= 0.2) return '🟡';
    return '🔴';
  };

  const fmtSim = (sim) => (sim * 100).toFixed(0) + '%';

  return (
    <div className="goal-row">
      <span>{goal.curriculum}</span>
      <span>{goal.area}</span>
      <span>{goal.code}</span>
      <span style={{ whiteSpace: 'pre-line' }}>
        {goal.summary}
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {hasDetail && (
            <button
              type="button"
              onClick={() => setIsStrategyOpen(!isStrategyOpen)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{isStrategyOpen ? '▼' : '▶'}</span>
              <span>수업 전략</span>
            </button>
          )}
          {hasRelated && (
            <button
              type="button"
              onClick={() => setIsRelatedOpen(!isRelatedOpen)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{isRelatedOpen ? '▼' : '▶'}</span>
              <span>관련 기준 및 기술</span>
            </button>
          )}
        </div>
        {isStrategyOpen && hasDetail && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            {goal.detail && <small className="muted" style={{ display: 'block', marginBottom: '4px' }}>{goal.detail}</small>}
            {goal.reinforcement && <small className="muted" style={{ display: 'block' }}>{goal.reinforcement}</small>}
          </div>
        )}
        {isRelatedOpen && hasRelated && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            <ul style={{ paddingLeft: '20px', margin: '0' }}>
              {goal.related_goals.map((rel, idx) => (
                <li key={`${rel.code}-${idx}`} style={{ marginBottom: '4px', fontSize: '13px' }}>
                  {rel.similarity !== null && rel.similarity !== undefined ? simBadge(rel.similarity) : "▫️"} <strong>[{rel.curriculum || rel.area}]</strong>{" "}
                  ({rel.similarity !== null && rel.similarity !== undefined ? fmtSim(rel.similarity) : "—"}) <strong>{rel.code}</strong> {rel.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </span>
    </div>
  );
}

function GoalLibraryTab({ iepLibrary, onUpdateLibrary, enqueueAlert }) {
  const [search, setSearch] = useState("");
  const [curriculumFilter, setCurriculumFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [codeFilter, setCodeFilter] = useState("");
  const fileInputRef = useRef(null);

  // Excel 내보내기 함수
  const handleExportToExcel = () => {
    try {
      // 모든 목표를 Excel 형식으로 변환
      const allGoals = [];

      // related 항목 추가
      (iepLibrary?.related || []).forEach(entry => {
        // 관련 목표 문장 추출 (최대 10개, 코드만 표시)
        const relatedGoals = (entry.related_goals || []).slice(0, 10);
        const relatedCodes = relatedGoals.map((rg, idx) =>
          `${idx + 1}. ${rg.code} (${(rg.similarity * 100).toFixed(0)}%)`
        ).join('\n');

        allGoals.push({
          '커리큘럼': entry.curriculum,
          '영역': entry.area,
          '코드': entry.code,
          '목표문장': entry.text,
          '수업전략_절차': entry.originalData?.procedure || '',
          '수업전략_강화': entry.originalData?.reinforcement || '',
          '관련목표_코드': relatedCodes || '',
          '원본타입': 'related'
        });
      });

      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allGoals);

      // 컬럼 너비 설정
      ws['!cols'] = [
        { wch: 15 },  // 커리큘럼
        { wch: 15 },  // 영역
        { wch: 30 },  // 코드
        { wch: 60 },  // 목표문장
        { wch: 40 },  // 수업전략_절차
        { wch: 40 },  // 수업전략_강화
        { wch: 35 },  // 관련목표_코드
        { wch: 12 }   // 원본타입
      ];

      XLSX.utils.book_append_sheet(wb, ws, "목표 라이브러리");

      // 파일명 생성 (날짜 포함)
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      const fileName = `G-LENS_목표라이브러리_${dateStr}.xlsx`;

      // 다운로드
      XLSX.writeFile(wb, fileName);
      enqueueAlert(`Excel 파일이 다운로드되었습니다: ${fileName}`, "success");
    } catch (error) {
      console.error('Excel export error:', error);
      enqueueAlert(`Excel 내보내기 실패: ${error.message}`, "error");
    }
  };

  // Excel 가져오기 함수
  const handleImportFromExcel = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // 첫 번째 시트 읽기
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (!jsonData || jsonData.length === 0) {
          enqueueAlert('Excel 파일에 데이터가 없습니다.', 'error');
          return;
        }

        // 데이터 구조 검증
        const requiredColumns = ['커리큘럼', '영역', '코드', '목표문장'];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          enqueueAlert(`필수 컬럼이 누락되었습니다: ${missingColumns.join(', ')}`, 'error');
          return;
        }

        // Excel 데이터를 iepLibrary 형식으로 변환
        const newRelated = jsonData.map(row => ({
          curriculum: row['커리큘럼'] || '',
          area: row['영역'] || '',
          code: row['코드'] || '',
          text: row['목표문장'] || '',
          originalData: {
            procedure: row['수업전략_절차'] || '',
            reinforcement: row['수업전략_강화'] || ''
          }
        }));

        // 업데이트된 라이브러리 생성
        const updatedLibrary = {
          ...iepLibrary,
          related: newRelated
        };

        // 라이브러리 업데이트
        if (onUpdateLibrary) {
          onUpdateLibrary(updatedLibrary);
          enqueueAlert(`${jsonData.length}개의 목표가 성공적으로 가져와졌습니다.`, 'success');
        }

        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Excel import error:', error);
        enqueueAlert(`Excel 가져오기 실패: ${error.message}`, 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Reset domain filter when curriculum changes
  React.useEffect(() => {
    setDomainFilter("all");
  }, [curriculumFilter]);

  // Extract unique values for filters
  const { curriculums, allDomains } = useMemo(() => {
    const curriculumSet = new Set();
    const domainsByCurriculum = {};

    (iepLibrary?.lifeskills || []).forEach(entry => {
      const curr = "LifeSkills";
      curriculumSet.add(curr);
      if (!domainsByCurriculum[curr]) domainsByCurriculum[curr] = new Set();
      if (entry.domain) domainsByCurriculum[curr].add(entry.domain);
    });

    (iepLibrary?.related || []).forEach(entry => {
      const curr = entry.curriculum;
      if (curr) curriculumSet.add(curr);
      if (!domainsByCurriculum[curr]) domainsByCurriculum[curr] = new Set();
      if (entry.area) domainsByCurriculum[curr].add(entry.area);
    });

    return {
      curriculums: Array.from(curriculumSet).sort(),
      allDomains: domainsByCurriculum
    };
  }, [iepLibrary]);

  // Get domains for selected curriculum
  const availableDomains = useMemo(() => {
    if (curriculumFilter === "all") {
      // Show all domains with curriculum prefix
      const domainsWithCurriculum = [];
      Object.entries(allDomains).forEach(([curriculum, domainSet]) => {
        Array.from(domainSet).forEach(domain => {
          domainsWithCurriculum.push(`${curriculum} - ${domain}`);
        });
      });
      return domainsWithCurriculum.sort();
    } else {
      // Show only domains for selected curriculum
      const domains = allDomains[curriculumFilter] || new Set();
      const domainArray = Array.from(domains);

      // Curriculum-specific sorting
      if (curriculumFilter === "EFL") {
        return domainArray.sort((a, b) => {
          const numA = parseInt(a.match(/Domain\s+(\d+)/)?.[1] || '999');
          const numB = parseInt(b.match(/Domain\s+(\d+)/)?.[1] || '999');
          return numA - numB;
        });
      }

      if (curriculumFilter === "VB-MAPP") {
        const areaOrder = ['Mand', 'Tact', 'LR', 'VP/MTS', 'Play', 'Social', 'Imitation', 'Echoic', 'Vocal', 'LRFFC', 'Intraverbal', 'Group', 'Linguistic', 'Reading', 'Writing', 'Math'];
        return domainArray.sort((a, b) => {
          const aIdx = areaOrder.indexOf(a);
          const bIdx = areaOrder.indexOf(b);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
      }

      if (curriculumFilter === "교육과정") {
        const areaOrder = ['바생', '슬생', '즐생', '실과', '국어', '사회', '수학', '과학', '진로', '체육', '음악', '미술', '정통', '보건', '생영'];
        return domainArray.sort((a, b) => {
          const aIdx = areaOrder.indexOf(a);
          const bIdx = areaOrder.indexOf(b);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
      }

      if (curriculumFilter === "PBIS") {
        const areaOrder = ['모든장소', '교실', '복도계단', '화장실', '급식실'];
        return domainArray.sort((a, b) => {
          const aIdx = areaOrder.indexOf(a);
          const bIdx = areaOrder.indexOf(b);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
      }

      if (curriculumFilter === "LifeSkills") {
        const areaOrder = ['자립생활', '자기조절', '의사소통', '상호작용', '학습참여', '학습기초', '학업기술', '일상생활', '진로직업'];
        return domainArray.sort((a, b) => {
          const aIdx = areaOrder.indexOf(a);
          const bIdx = areaOrder.indexOf(b);
          return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
        });
      }

      return domainArray.sort();
    }
  }, [allDomains, curriculumFilter]);

  const library = useMemo(() => {
    let merged = [];

    // Add LifeSkills entries first (with updated goal text)
    (iepLibrary?.lifeskills || []).forEach(entry => {
      merged.push({
        id: `${entry.curriculum || 'LifeSkills'}-${entry.code}`,
        curriculum: entry.curriculum || 'LifeSkills',
        area: entry.domain || entry.area || '',
        code: entry.code,
        summary: entry.goal,  // Use the refined goal text
        detail: entry.procedure || "",
        reinforcement: entry.reinforcement || null,
        status: "active"
      });
    });

    // Add all entries from related (non-LifeSkills curricula)
    (iepLibrary?.related || []).forEach(entry => {
      // Skip LifeSkills entries from related array to avoid duplicates
      if (entry.curriculum === 'LifeSkills') return;

      merged.push({
        id: `${entry.curriculum}-${entry.code}`,
        curriculum: entry.curriculum,
        area: entry.area,
        code: entry.code,
        summary: entry.text,
        detail: entry.originalData?.procedure || (entry.originalData?.lifeId ? `LifeSkills 연계: ${entry.originalData.lifeId}` : ""),
        reinforcement: entry.originalData?.reinforcement || null,
        status: "active"
      });
    });

    // Apply curriculum filter
    if (curriculumFilter !== "all") {
      merged = merged.filter(goal => goal.curriculum === curriculumFilter);
    }

    // Apply domain filter
    if (domainFilter !== "all") {
      if (curriculumFilter === "all") {
        // When "전체" is selected, domain has format "Curriculum - Area"
        merged = merged.filter(goal => {
          const domainWithCurriculum = `${goal.curriculum} - ${goal.area}`;
          return domainWithCurriculum === domainFilter;
        });
      } else {
        // When specific curriculum is selected, match area directly
        merged = merged.filter(goal => goal.area === domainFilter);
      }
    }

    // Apply code filter
    if (codeFilter.trim()) {
      const codeSearch = codeFilter.trim().toLowerCase();
      merged = merged.filter(goal =>
        (goal.code || "").toLowerCase().includes(codeSearch)
      );
    }

    // Apply search filter
    if (search.trim()) {
      const lower = search.trim().toLowerCase();
      merged = merged.filter(goal =>
        (goal.curriculum || "").toLowerCase().includes(lower) ||
        (goal.area || "").toLowerCase().includes(lower) ||
        (goal.code || "").toLowerCase().includes(lower) ||
        (goal.summary || "").toLowerCase().includes(lower)
      );
    }

    // Sort results
    merged.sort((a, b) => {
      // LifeSkills sorting
      if (a.curriculum === 'LifeSkills' && b.curriculum === 'LifeSkills') {
        // 영역 순서 (평가도구 순서)
        const areaOrder = ['자립생활', '자기조절', '의사소통', '상호작용', '학습참여', '학습기초', '학업기술', '일상생활', '진로직업'];
        const aAreaIdx = areaOrder.indexOf(a.area);
        const bAreaIdx = areaOrder.indexOf(b.area);

        if (aAreaIdx !== bAreaIdx) {
          return (aAreaIdx === -1 ? 999 : aAreaIdx) - (bAreaIdx === -1 ? 999 : bAreaIdx);
        }

        // Extract numbers from code: [L-자립생활-1-01]
        const extractLifeSkillsNum = (code) => {
          const match = code.match(/\[L-[^-]+-(\d+)-(\d+)\]/);
          if (!match) return [0, 0];
          return [parseInt(match[1]), parseInt(match[2])];
        };

        const [aNum1, aNum2] = extractLifeSkillsNum(a.code);
        const [bNum1, bNum2] = extractLifeSkillsNum(b.code);

        if (aNum1 !== bNum1) return aNum1 - bNum1;
        return aNum2 - bNum2;
      }

      // EFL sorting
      if (a.curriculum === 'EFL' && b.curriculum === 'EFL') {
        // Extract domain number: [E-D10-CP-1]
        const extractDomainNum = (code) => {
          const match = code.match(/\[E-D(\d+)-/);
          return match ? parseInt(match[1]) : 999;
        };

        const aDomainNum = extractDomainNum(a.code);
        const bDomainNum = extractDomainNum(b.code);

        if (aDomainNum !== bDomainNum) return aDomainNum - bDomainNum;
        return (a.code || '').localeCompare(b.code || '');
      }

      // VB-MAPP sorting
      if (a.curriculum === 'VB-MAPP' && b.curriculum === 'VB-MAPP') {
        const areaOrder = ['Mand', 'Tact', 'LR', 'VP/MTS', 'Play', 'Social', 'Imitation', 'Echoic', 'Vocal', 'LRFFC', 'Intraverbal', 'Group', 'Linguistic', 'Reading', 'Writing', 'Math'];
        const aAreaIdx = areaOrder.indexOf(a.area);
        const bAreaIdx = areaOrder.indexOf(b.area);

        if (aAreaIdx !== bAreaIdx) {
          return (aAreaIdx === -1 ? 999 : aAreaIdx) - (bAreaIdx === -1 ? 999 : bAreaIdx);
        }

        // Extract numbers for secondary sort
        const extractVBNum = (code) => {
          const match = code.match(/(\d+)\]$/);
          return match ? parseInt(match[1]) : 0;
        };

        return extractVBNum(a.code) - extractVBNum(b.code);
      }

      // 교육과정 sorting
      if (a.curriculum === '교육과정' && b.curriculum === '교육과정') {
        const areaOrder = ['바생', '슬생', '즐생', '실과', '국어', '사회', '수학', '과학', '진로', '체육', '음악', '미술', '정통', '보건', '생영'];
        const aAreaIdx = areaOrder.indexOf(a.area);
        const bAreaIdx = areaOrder.indexOf(b.area);

        if (aAreaIdx !== bAreaIdx) {
          return (aAreaIdx === -1 ? 999 : aAreaIdx) - (bAreaIdx === -1 ? 999 : bAreaIdx);
        }

        // Extract grade number from code: [2바생01-01]
        const extractGrade = (code) => {
          const match = code.match(/\[(\d+)/);
          return match ? parseInt(match[1]) : 0;
        };

        const aGrade = extractGrade(a.code);
        const bGrade = extractGrade(b.code);

        // Grade order: 2, 4, 6, 9, 12
        const gradeOrder = [2, 4, 6, 9, 12];
        const aGradeIdx = gradeOrder.indexOf(aGrade);
        const bGradeIdx = gradeOrder.indexOf(bGrade);

        if (aGradeIdx !== bGradeIdx) {
          return (aGradeIdx === -1 ? 999 : aGradeIdx) - (bGradeIdx === -1 ? 999 : bGradeIdx);
        }

        return (a.code || '').localeCompare(b.code || '');
      }

      // PBIS sorting
      if (a.curriculum === 'PBIS' && b.curriculum === 'PBIS') {
        // 1순위: 영역 (모든장소, 교실, 복도계단, 화장실, 급식실)
        const areaOrder = ['모든장소', '교실', '복도계단', '화장실', '급식실'];
        const aAreaIdx = areaOrder.indexOf(a.area);
        const bAreaIdx = areaOrder.indexOf(b.area);

        if (aAreaIdx !== bAreaIdx) {
          return (aAreaIdx === -1 ? 999 : aAreaIdx) - (bAreaIdx === -1 ? 999 : bAreaIdx);
        }

        // 2순위: 행동 (스스로, 바르게, 안전)
        const extractBehavior = (code) => {
          const match = code.match(/\[P-[^-]+-([^-\]]+)/);
          return match ? match[1] : '';
        };

        const aBehavior = extractBehavior(a.code);
        const bBehavior = extractBehavior(b.code);

        const behaviorOrder = ['스스로', '바르게', '안전'];
        const aBehaviorIdx = behaviorOrder.findIndex(b => aBehavior.includes(b));
        const bBehaviorIdx = behaviorOrder.findIndex(b => bBehavior.includes(b));

        if (aBehaviorIdx !== bBehaviorIdx) {
          return (aBehaviorIdx === -1 ? 999 : aBehaviorIdx) - (bBehaviorIdx === -1 ? 999 : bBehaviorIdx);
        }

        // 3순위: 숫자
        const extractNumber = (code) => {
          const match = code.match(/(\d+)(?:-(\d+))?\]$/);
          if (!match) return [0, 0];
          return [parseInt(match[1] || '0'), parseInt(match[2] || '0')];
        };

        const [aNum1, aNum2] = extractNumber(a.code);
        const [bNum1, bNum2] = extractNumber(b.code);

        if (aNum1 !== bNum1) return aNum1 - bNum1;
        return aNum2 - bNum2;
      }

      // Default: sort by curriculum, then area, then code
      if (a.curriculum !== b.curriculum) {
        return (a.curriculum || '').localeCompare(b.curriculum || '');
      }
      if (a.area !== b.area) {
        return (a.area || '').localeCompare(b.area || '');
      }
      return (a.code || '').localeCompare(b.code || '');
    });

    return merged;
  }, [iepLibrary, search, curriculumFilter, domainFilter, codeFilter]);

  return (
    <section className="card">
      <h2>🎯 목표 목록 라이브러리</h2>
      <p className="muted">LifeSkills 세부 기준 225개와 2022 교육과정·VB-MAPP·EFL·PBIS 기준을 코드와 함께 확인할 수 있습니다.</p>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportToExcel}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #2563eb',
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📥 Excel로 내보내기
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleImportFromExcel}
          style={{ display: 'none' }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #059669',
            background: '#059669',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📤 Excel에서 가져오기
        </button>

        <span className="muted" style={{ alignSelf: 'center', marginLeft: '8px', fontSize: '13px' }}>
          Excel 파일로 목표 라이브러리를 통합 관리할 수 있습니다
        </span>
      </div>

      <div className="goal-library-controls">
        <input
          type="search"
          placeholder="전체 내용 검색 (제목, 코드, 설명 등)"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ marginBottom: '12px' }}
        />

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>커리큘럼</span>
            <select
              value={curriculumFilter}
              onChange={(e) => setCurriculumFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            >
              <option value="all">전체</option>
              {curriculums.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>영역</span>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            >
              <option value="all">전체</option>
              {availableDomains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '200px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>코드</span>
            <input
              type="text"
              placeholder="코드 검색 (예: L-자립생활)"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
          </label>

          {(curriculumFilter !== "all" || domainFilter !== "all" || codeFilter.trim()) && (
            <button
              onClick={() => {
                setCurriculumFilter("all");
                setDomainFilter("all");
                setCodeFilter("");
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              필터 초기화
            </button>
          )}
        </div>

        <span className="muted" style={{ marginTop: '8px', display: 'block' }}>총 {library.length}개 목표</span>
      </div>

      <div className="goal-library-table">
        <div className="goal-head">
          <span>커리큘럼</span>
          <span>영역</span>
          <span>코드</span>
          <span>목표 문장</span>
        </div>
        {library.map(goal => (
          <GoalLibraryRow key={goal.id} goal={goal} />
        ))}
      </div>
    </section>
  );
}

function App() {
  // Register Chart.js datalabels plugin globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ChartGlobal = window.Chart?.Chart || window.Chart?.default || window.Chart;
      const ChartDataLabels = window.ChartDataLabels;
      if (ChartGlobal && ChartDataLabels && ChartGlobal.register) {
        ChartGlobal.register(ChartDataLabels);
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState(TAB_KEYS.students);
  const [alerts, setAlerts] = useState([]);
const [lifeData, setLifeData] = useState(null);
const [mappings, setMappings] = useState([]);
const [iepLibrary, setIepLibrary] = useState({ lifeskills: [], related: [] });
const [students, setStudents] = useState(() => loadFromStorage(LOCAL_STORAGE_KEYS.students, DEFAULT_STUDENTS));
const [evaluations, setEvaluations] = useState(() => loadFromStorage(LOCAL_STORAGE_KEYS.evaluations, DEFAULT_EVALUATIONS));
const [studentGoals, setStudentGoals] = useState(() => loadFromStorage("glens-student-goals", DEFAULT_STUDENT_GOALS));
  const [threshold, setThreshold] = useState(REL_THRESHOLD_DEFAULT);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const enqueueAlert = (message, type = "info", ttl = 6000) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setAlerts(prev => [...prev, { id, message, type }]);
    if (ttl > 0) {
      window.setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, ttl);
    }
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      try {
        const [lifeRaw, mappingRaw, iepRaw] = await Promise.allSettled([
          fetchJSON("data/lifeskills.json"),
          fetchJSON("data/mapping_index.json"),
          fetchJSON("data/iep_library_with_similarities.json")
        ]);
        if (lifeRaw.status === "fulfilled") {
          setLifeData(reshapeLifeData(lifeRaw.value));
        } else {
          throw lifeRaw.reason;
        }
        if (mappingRaw.status === "fulfilled") {
          setMappings(Array.isArray(mappingRaw.value) ? mappingRaw.value : []);
        } else {
          enqueueAlert("mapping_index.json 로드 실패 — 관련 기준 추천이 제한됩니다.", "warning");
        }
        if (iepRaw.status === "fulfilled") {
          setIepLibrary(iepRaw.value || { lifeskills: [], related: [] });
        } else {
          enqueueAlert("iep_library.json 로드 실패 — IEP 라이브러리가 제한됩니다.", "warning");
        }
      } catch (error) {
        console.error(error);
        enqueueAlert(error.message || "데이터 로드 중 오류가 발생했습니다.", "error", 8000);
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    }
    bootstrap();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    saveToStorage(LOCAL_STORAGE_KEYS.students, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(LOCAL_STORAGE_KEYS.evaluations, evaluations);
  }, [evaluations]);

  useEffect(() => {
    saveToStorage("glens-student-goals", studentGoals);
  }, [studentGoals]);

  const handleAddStudent = (student) => {
    setStudents(prev => [...prev, student]);
    enqueueAlert(`${student.name} 학생을 등록했습니다.`, "success");
  };

  const handleUpdateStudent = (studentId, updatedData) => {
    setStudents(prev => prev.map(student =>
      student.id === studentId ? { ...student, ...updatedData } : student
    ));
    enqueueAlert(`${updatedData.name} 학생 정보를 수정했습니다.`, "success");
  };

  const handleDeleteStudent = (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (!confirm(`"${student.name}" 학생을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 해당 학생의 모든 평가 데이터와 IEP 목표도 함께 삭제됩니다.`)) {
      return;
    }

    // 학생 삭제
    setStudents(prev => prev.filter(s => s.id !== studentId));

    // 해당 학생의 평가 데이터 삭제
    setEvaluations(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    // 해당 학생의 IEP 목표 삭제
    setStudentGoals(prev => {
      const copy = { ...prev };
      delete copy[studentId];
      return copy;
    });

    // 해당 학생의 세션 데이터 삭제 (localStorage)
    localStorage.removeItem(`iep_sessions_${studentId}`);

    enqueueAlert(`${student.name} 학생과 관련 데이터를 모두 삭제했습니다.`, "success");
  };

  const handleSaveEvaluation = (studentId, monthKey, payload) => {
    setEvaluations(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [monthKey]: payload
      }
    }));
    enqueueAlert(`${monthKeyToLabel(monthKey)} 평가가 저장되었습니다.`, "success");
  };

  // JSON 데이터 내보내기
  const handleExportData = () => {
    try {
      const exportData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        students,
        evaluations,
        studentGoals
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `glens-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      enqueueAlert("데이터를 성공적으로 내보냈습니다.", "success");
    } catch (error) {
      console.error(error);
      enqueueAlert("데이터 내보내기 중 오류가 발생했습니다.", "error");
    }
  };

  // JSON 데이터 가져오기
  const handleImportData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // 데이터 유효성 검증
        if (!importedData.students || !Array.isArray(importedData.students)) {
          throw new Error("올바르지 않은 데이터 형식입니다.");
        }

        // 사용자 확인
        const confirmMessage = `
데이터를 가져오시겠습니까?
- 학생: ${importedData.students.length}명
- 평가 데이터: ${Object.keys(importedData.evaluations || {}).length}개
- 목표 데이터: ${Object.keys(importedData.studentGoals || {}).length}개

경고: 현재 데이터가 모두 교체됩니다. 계속하시겠습니까?
        `.trim();

        if (window.confirm(confirmMessage)) {
          setStudents(importedData.students);
          setEvaluations(importedData.evaluations || {});
          setStudentGoals(importedData.studentGoals || {});
          enqueueAlert("데이터를 성공적으로 가져왔습니다.", "success");
        }
      } catch (error) {
        console.error(error);
        enqueueAlert(`데이터 가져오기 실패: ${error.message}`, "error");
      }
    };
    reader.readAsText(file);

    // 파일 입력 초기화 (같은 파일을 다시 선택할 수 있도록)
    event.target.value = '';
  };

  // 데이터 병합 가져오기
  const handleMergeData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!importedData.students || !Array.isArray(importedData.students)) {
          throw new Error("올바르지 않은 데이터 형식입니다.");
        }

        // 학생 병합 (중복 ID 체크)
        const existingIds = new Set(students.map(s => s.id));
        const newStudents = importedData.students.filter(s => !existingIds.has(s.id));

        // 평가 데이터 병합
        const mergedEvaluations = { ...evaluations };
        Object.entries(importedData.evaluations || {}).forEach(([studentId, evalData]) => {
          mergedEvaluations[studentId] = {
            ...(mergedEvaluations[studentId] || {}),
            ...evalData
          };
        });

        // 목표 데이터 병합
        const mergedGoals = { ...studentGoals };
        Object.entries(importedData.studentGoals || {}).forEach(([studentId, goalData]) => {
          mergedGoals[studentId] = {
            ...(mergedGoals[studentId] || {}),
            ...goalData
          };
        });

        const confirmMessage = `
데이터를 병합하시겠습니까?
- 새로운 학생: ${newStudents.length}명
- 중복 학생 (건너뜀): ${importedData.students.length - newStudents.length}명

기존 데이터는 유지되고 새로운 데이터가 추가됩니다.
        `.trim();

        if (window.confirm(confirmMessage)) {
          setStudents(prev => [...prev, ...newStudents]);
          setEvaluations(mergedEvaluations);
          setStudentGoals(mergedGoals);
          enqueueAlert(`${newStudents.length}명의 학생 데이터를 병합했습니다.`, "success");
        }
      } catch (error) {
        console.error(error);
        enqueueAlert(`데이터 병합 실패: ${error.message}`, "error");
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  // IEP 라이브러리 업데이트 함수
  const handleUpdateLibrary = (updatedLibrary) => {
    setIepLibrary(updatedLibrary);
    enqueueAlert("목표 라이브러리가 업데이트되었습니다.", "success");
  };

  return (
    <div className="app-shell">
      <Alerts alerts={alerts} onDismiss={dismissAlert}/>
      <header className="topbar">
        <div className="topbar-row">
          <div className="brand">
            <strong>G-LENS</strong>
            <span className="subtitle">LifeSkills 평가 · VB-MAPP 매핑 · IEP 내비게이터</span>
          </div>
        </div>
        <div className="topbar-row">
          <TabNav activeTab={activeTab} onChange={setActiveTab}/>
          <div className="actions">
            {/* 데이터 관리 버튼 */}
            <button type="button" className="btn light" onClick={handleExportData} title="모든 데이터를 JSON 파일로 내보내기">
              💾 백업
            </button>

            <label className="btn light" style={{ cursor: 'pointer', margin: 0 }} title="JSON 파일에서 데이터 가져오기 (덮어쓰기)">
              📥 가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>

            <label className="btn light" style={{ cursor: 'pointer', margin: 0 }} title="JSON 파일에서 데이터 병합하기">
              🔄 병합
              <input
                type="file"
                accept=".json"
                onChange={handleMergeData}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </header>

      {isLoadingData ? (
        <section className="card">
          <div className="muted">기준 데이터를 불러오는 중입니다...</div>
        </section>
      ) : null}

      {activeTab === TAB_KEYS.students ? (
        <StudentRegistrationTab students={students} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent}/>
      ) : null}

      {activeTab === TAB_KEYS.evaluation ? (
        <EvaluationTab
          students={students}
          lifeData={lifeData}
          evaluations={evaluations}
          onSaveEvaluation={handleSaveEvaluation}
        />
      ) : null}

      {activeTab === TAB_KEYS.report ? (
        <ReportTab
          students={students}
          evaluations={evaluations}
          lifeData={lifeData}
          mappings={mappings}
          threshold={threshold}
          onThresholdChange={setThreshold}
          onNotify={enqueueAlert}
          iepLibrary={iepLibrary}
        />
      ) : null}

      {activeTab === TAB_KEYS.dashboard ? (
        <DashboardTab
          students={students}
          evaluations={evaluations}
          lifeData={lifeData}
          mappings={mappings}
          threshold={threshold}
          onThresholdChange={setThreshold}
          iepLibrary={iepLibrary}
          studentGoals={studentGoals}
          onAssignGoal={(studentId, goal) => {
            setStudentGoals(prev => {
              const next = { ...prev };
              const base = next[studentId] || { active: [], completed: [], hold: [] };
              if (!base.active.some(item => item.code === goal.code) && !base.completed.some(item => item.code === goal.code) && !base.hold.some(item => item.code === goal.code)) {
                base.active = [...base.active, { ...goal, status: "active", assignedAt: new Date().toISOString() }];
              }
              next[studentId] = base;
              return next;
            });
            enqueueAlert(`${goal.code} 목표를 진행 중 목록에 추가했습니다.`, "success");
          }}
          onUpdateGoalStatus={(studentId, code, status) => {
            setStudentGoals(prev => {
              const base = { active: [], completed: [], hold: [], ...(prev[studentId] || {}) };
              const all = [...base.active, ...base.completed, ...base.hold];
              const target = all.find(item => item.code === code);
              if (!target) return prev;
              const updated = {
                active: base.active.filter(item => item.code !== code),
                completed: base.completed.filter(item => item.code !== code),
                hold: base.hold.filter(item => item.code !== code)
              };
              if (status === "completed") {
                updated.completed = [...updated.completed, { ...target, status: "completed", completedAt: new Date().toISOString() }];
              } else if (status === "hold") {
                updated.hold = [...updated.hold, { ...target, status: "hold", holdAt: new Date().toISOString() }];
              } else if (status === "active") {
                updated.active = [...updated.active, { ...target, status: "active" }];
              }
              return { ...prev, [studentId]: updated };
            });
            enqueueAlert(`${code} 목표 상태를 '${status}'로 변경했습니다.`, "success");
          }}
          onRemoveGoal={(studentId, code) => {
            if (!confirm(`${code} 목표를 삭제하시겠습니까?`)) return;
            setStudentGoals(prev => {
              const base = { active: [], completed: [], hold: [], ...(prev[studentId] || {}) };
              const updated = {
                active: base.active.filter(item => item.code !== code),
                completed: base.completed.filter(item => item.code !== code),
                hold: base.hold.filter(item => item.code !== code)
              };
              return { ...prev, [studentId]: updated };
            });
            enqueueAlert(`${code} 목표를 삭제했습니다.`, "success");
          }}
        />
      ) : null}

      {activeTab === TAB_KEYS.goals ? (
        <GoalLibraryTab
          iepLibrary={iepLibrary}
          onUpdateLibrary={handleUpdateLibrary}
          enqueueAlert={enqueueAlert}
        />
      ) : null}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("app-root")).render(<App/>);
