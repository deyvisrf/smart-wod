"use server";

export type WodBlock = {
  title: string;
  items: string[];
};

export type LoadRecommendation =
  | string
  | {
      movement?: string;
      rxLoad?: string; // ex.: 40kg / 30kg
      scaleLoad?: string; // ex.: 30kg / 20kg
      male?: string; // alternativa de retorno
      female?: string; // alternativa de retorno
      load?: string; // fallback genérico
      notes?: string;
    };

export type GeneratedWod = {
  title: string;
  level: string;
  durationMinutes?: number;
  warmup?: WodBlock;
  main?: WodBlock;
  cooldown?: WodBlock;
  notes?: string;
  modelUsed?: string;
  source?: 'openai' | 'mock';
  loadRecommendations?: LoadRecommendation[]; // pode ser string ou objeto
};

export type GenerateWodInput = {
  level: string;
  goal: string;
  equipment: string[]; // lista de equipamentos disponíveis
  duration: number;
  style?: 'AMRAP' | 'EMOM' | 'For Time' | 'Chipper';
  preset?: 'RX' | 'Scaled';
  includeLoads?: boolean; // incluir recomendações de cargas M/F
  prompt?: string;
};

function buildPrompt(input: GenerateWodInput): string {
  const base = `Você é um coach de CrossFit. Gere um WOD claro e seguro, adequado ao nível do atleta.
Nível: ${input.level}
Objetivo principal: ${input.goal}
Equipamentos disponíveis: ${
    Array.isArray(input.equipment) && input.equipment.length > 0
      ? input.equipment.join(', ')
      : 'livre'
  }
Duração total desejada (min): ${input.duration}
Público-alvo: praticantes de CrossFit que já conhecem a terminologia.
Estilo de linguagem: direto, objetivo e conciso, sem explicações pedagógicas.
Terminologia: use padrões CrossFit (AMRAP, EMOM, For Time, Chipper, RX, scale), quando fizer sentido.
Carga: se sugerir cargas, use kg (por exemplo: 40/30kg) e indique RX/scale.
Estrutura: retorne blocos curtos e práticos de aquecimento, principal e desaquecimento.
${input.style ? `Formato do treino exigido: ${input.style}.` : ''}
${input.preset ? `Preset de intensidade: ${input.preset}.` : ''}
${input.includeLoads ? 'Inclua recomendações de carga por movimento, preferencialmente no padrão Masculino/Feminino (ex.: 40/30kg), em um campo separado loadRecommendations[].' : ''}
`;
  const extra = input.prompt?.trim() ? `Instruções adicionais do usuário: ${input.prompt}` : '';
  return `${base}${extra}`;
}

function mockWod(input: GenerateWodInput): GeneratedWod {
  return {
    title: `WOD ${input.goal} (${input.level})`,
    level: input.level,
    durationMinutes: input.duration,
    warmup: {
      title: 'Aquecimento (8-10 min)',
      items: [
        '3x: 20 polichinelos, 10 agachamentos, 10 rotações de ombro',
        '1-2 min mobilidade de quadril e tornozelo',
      ],
    },
    main: {
      title: 'AMRAP 18 min',
      items: [
        '200m corrida ou 1 min corrida estacionária',
        '10 box step-ups (5/5)',
        '12 kettlebell deadlifts (moderado)',
        '8 pull-ups assistidas',
      ],
    },
    cooldown: {
      title: 'Desaquecer (5-7 min)',
      items: ['Caminhada leve 2 min', 'Alongamentos de posterior, glúteos e peitoral'],
    },
    notes: 'Escala conforme necessário. Priorize técnica antes de intensidade.',
    modelUsed: 'mock',
    source: 'mock',
  };
}

export async function generateWodAction(input: GenerateWodInput): Promise<GeneratedWod> {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = buildPrompt(input);

  if (!apiKey) {
    console.log('[generateWodAction] OPENAI_API_KEY not set. Using mock.');
    return mockWod(input);
  }

  try {
    const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
    console.log(`[generateWodAction] Using OpenAI model: ${model}`);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify((() => {
        const base = {
          model,
          messages: [
            {
              role: 'system',
              content:
                'Responda apenas com um JSON válido contendo: title, level, durationMinutes, warmup{title,items[]}, main{title,items[]}, cooldown{title,items[]}, notes, loadRecommendations[]. Sem texto fora do JSON.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' as const },
        };
        // Alguns modelos (ex.: gpt-5) só aceitam o valor padrão (1) para temperature
        if (/^gpt-5/i.test(model)) {
          return { ...base, temperature: 1 };
        }
        return { ...base, temperature: 0.6 };
      })()),
    });

    if (!response.ok) {
      console.log('[generateWodAction] OpenAI response not OK. Falling back to mock.', response.status, await response.text());
      return mockWod(input);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return mockWod(input);

    try {
      let parsed: any;
      try {
        parsed = JSON.parse(content);
      } catch {
        // tenta extrair o primeiro bloco JSON
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const slice = content.slice(start, end + 1);
          parsed = JSON.parse(slice);
        } else {
          throw new Error('no-json-found');
        }
      }
      // validação leve
      if (!parsed?.title || !parsed?.main) return mockWod(input);
      return { ...(parsed as GeneratedWod), modelUsed: model, source: 'openai' };
    } catch {
      console.log('[generateWodAction] JSON parse failed. Falling back to mock.');
      return mockWod(input);
    }
  } catch {
    console.log('[generateWodAction] Unexpected error. Falling back to mock.');
    return mockWod(input);
  }
}


