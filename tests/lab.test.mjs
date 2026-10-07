import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { evaluateRepair, receiver, runHttp, httpRequests } from '../src/shared/activityRules.mjs';

// Usa el compilador ya instalado; no añade un runner ni modifica el código productivo.
async function dataModule(file) {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { CODE_TEMPLATES, referenceLine, referenceLines } = await dataModule('../src/data/codeTemplates.ts');
const { PRESET_CHAINS } = await dataModule('../src/data/presets.ts');
const { QUIZ_QUESTIONS } = await dataModule('../src/data/quizQuestions.ts');
const handlers = PRESET_CHAINS[0].handlers;
const passed = result => result.criteria.every(c => c.passed);

test('Gastos: responsables originales, reparación y acaparamiento', () => {
  assert.deepEqual([350, 2200, 8500, 32000].map(value => receiver(handlers, value)?.id), ['h-lead','h-manager','h-cfo','h-board']);
  const repair = evaluateRepair(0, { handlers });
  assert.equal(passed(repair), true);
  assert.equal(repair.criteria.length, 3);
  assert.equal(repair.evidence.length, 4);
  assert.equal(passed(evaluateRepair(0, { handlers: [handlers[3], ...handlers.slice(0,3)] })), false);
  assert.ok(PRESET_CHAINS[0].inputMax >= 95000);
  assert.equal(receiver(handlers, 95000), undefined);
});

test('Fallback: sin terminal falla; terminal y política conservan aceptación', () => {
  assert.equal(passed(evaluateRepair(1, { handlers })), false);
  const terminal = { ...handlers[0], id: 'fallback-test', operator: 'gte', threshold: 0, actionSummary: 'Rechazo de prueba' };
  const configured = [...handlers, terminal];
  assert.equal(passed(evaluateRepair(1, { handlers: configured })), false);
  for (const policy of ['Registrar y derivar a revisión','Rechazar explícitamente','Escalar a una autoridad externa']) {
    assert.equal(passed(evaluateRepair(1, { handlers: configured, policy })), true);
  }
  assert.equal(passed(evaluateRepair(1, { handlers: [...handlers, {...terminal, threshold: 95000}], policy: 'Rechazar explícitamente' })), false);
});

test('Middleware: 401, 403 y 200 auditados al regresar; ERP prematuro y auditoría tardía fallan', () => {
  const chain = ['Auditoría','Autenticación','Autorización','ERP'];
  const runs = httpRequests.map(req => runHttp(chain,req));
  assert.deepEqual(runs.map(r => r.status), [401,403,200]);
  assert.ok(runs.every(r => r.audited && r.safe && r.trace.at(-1).includes(`respuesta ${r.status}`)));
  assert.equal(passed(evaluateRepair(2, { chain })), true);
  const unsafe = ['ERP','Autenticación','Autorización','Auditoría'];
  assert.equal(runHttp(unsafe,httpRequests[2]).safe, false);
  assert.equal(passed(evaluateRepair(2,{chain:unsafe})), false);
  for (const late of [['Autenticación','Auditoría','Autorización','ERP'],['Autenticación','Autorización','Auditoría','ERP']]) {
    const rejected = runHttp(late,httpRequests[0]);
    assert.equal(rejected.status,401);
    assert.equal(rejected.audited,false);
    assert.ok(!rejected.trace.some(event=>event.startsWith('Auditoría:')));
    assert.equal(passed(evaluateRepair(2,{chain:late})),false);
  }
  assert.equal(runHttp(['Autenticación','Autorización','Auditoría','ERP'],httpRequests[1]).audited,false);
});

test('Las cinco claves apuntan una vez a operaciones pertinentes en cada lenguaje', () => {
  const operations = {
    client_send: /(?:lead\.(?:processRequest|handle|Handle))\(/,
    eval_condition: /if (?:\(|self\.can_handle|request\.Amount)/,
    do_handle: /(?:executeApproval|this\.process|self\.process|fmt\.Printf)/,
    call_successor: /(?:nextApprover\.processRequest|nextHandler\.handle|_successor\.handle|a\.next\.Handle)/,
    no_successor_sink: /(?:System\.err|console\.warn|print\(|fmt\.Printf)/,
  };
  for (const [language,template] of Object.entries(CODE_TEMPLATES)) {
    assert.deepEqual(template.lines.map(l=>l.lineNumber), template.lines.map((_,i)=>i+1));
    for (const [key,operation] of Object.entries(operations)) {
      const lines = template.lines.filter(l=>l.key===key);
      assert.equal(lines.length,1,`${language}/${key}`);
      const number = referenceLine(language,key);
      assert.match(template.lines[number-1].text,operation,`${language}/${key}`);
      assert.equal(referenceLines(key)[language],number);
    }
  }
});

test('Quiz: ocho IDs y respuestas correctas compatibles', () => {
  assert.deepEqual(QUIZ_QUESTIONS.map(q=>q.id),[1,2,3,4,5,6,7,8]);
  assert.deepEqual(QUIZ_QUESTIONS.map(q=>q.correctOptionId),['opt-c','opt-a','opt-d','opt-b','opt-d','opt-a','opt-b','opt-c']);
  assert.ok(QUIZ_QUESTIONS.every(q=>q.options.some(o=>o.id===q.correctOptionId)));
});
