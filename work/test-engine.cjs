'use strict';
const assert = require('node:assert/strict');
const { Game, C, blade, segmentDistance } = require('./engine.js');
const DT = 1 / 600;
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('PASS ' + name); }
  catch (error) { console.error('FAIL ' + name); throw error; }
}
function fresh(distance = 120) {
  const game = new Game({ ai: false, random: () => .5 });
  game.start(); game.events = [];
  game.fighters[0].x = 500;
  game.fighters[1].x = 500 + distance;
  return game;
}
function advance(game, duration, input = {}) {
  for (let elapsed = 0; elapsed < duration - 1e-9; elapsed += DT)
    game.step(Math.min(DT, duration - elapsed), input);
}
function horizontal(game, id = 0) {
  const f = game.fighters[id];
  game.setState(f, 'active', C.active);
  f.stateTime = C.active * (1.48 / 2.4);
  f.attackHit = false;
  return f;
}
function hasEvent(game, type) { return game.events.some(event => event.type === type); }

test('segment geometry handles crossing, touching, separated and degenerate blades', () => {
  assert.equal(segmentDistance({x:0,y:0},{x:10,y:10},{x:0,y:10},{x:10,y:0}), 0);
  assert.equal(segmentDistance({x:0,y:0},{x:10,y:0},{x:10,y:0},{x:20,y:0}), 0);
  assert.equal(segmentDistance({x:0,y:0},{x:10,y:0},{x:0,y:5},{x:10,y:5}), 5);
  assert.equal(segmentDistance({x:0,y:0},{x:0,y:0},{x:3,y:4},{x:3,y:4}), 5);
});

test('a single physical blade contact kills and awards exactly one point', () => {
  const game = fresh(); horizontal(game);
  assert.equal(game.bodyContact(game.fighters[0], game.fighters[1]), true);
  game.resolveCombat();
  assert.equal(game.fighters[1].dead, true);
  assert.equal(game.fighters[0].dead, false);
  assert.deepEqual(game.score, [1, 0]);
  assert.equal(game.phase, 'roundEnd');
  game.resolveCombat(); advance(game, .5);
  assert.deepEqual(game.score, [1, 0]);
  assert.equal(game.events.filter(event => event.type === 'kill').length, 1);
});

test('startup and recovery cannot kill even when the visible blade touches a body', () => {
  for (const state of ['startup', 'recovery']) {
    const game = fresh(60);
    const f = game.fighters[0];
    game.setState(f, state, C[state]);
    if (state === 'recovery') f.stateTime = C.recovery / 2;
    assert.equal(game.bodyContact(f, game.fighters[1]), true, state + ' fixture must touch');
    game.resolveCombat();
    assert.equal(game.fighters[1].dead, false, state);
    assert.deepEqual(game.score, [0, 0]);
  }
});

test('the physical sword endpoint distinguishes a 0.2px near miss from a hit', () => {
  const miss = fresh(152.6); horizontal(miss);
  const visible = blade(miss.fighters[0]);
  assert.ok(Math.abs(visible.b.x - 634) < 1e-8);
  miss.resolveCombat(); assert.equal(miss.fighters[1].dead, false);
  const hit = fresh(152.4); horizontal(hit);
  hit.resolveCombat(); assert.equal(hit.fighters[1].dead, true);
});

test('attack phases cannot be canceled or restarted by attack/parry/dash spam', () => {
  const game = fresh(400); const f = game.fighters[0];
  assert.equal(game.attack(0), true); const attackId = f.attackId;
  advance(game, C.startup / 2);
  assert.equal(f.state, 'startup');
  assert.equal(game.attack(0), false); assert.equal(game.parry(0), false); assert.equal(game.dash(0), false);
  assert.equal(f.attackId, attackId);
  advance(game, C.startup / 2 + DT * 2);
  assert.equal(f.state, 'active');
  assert.equal(game.attack(0), false);
  advance(game, C.active + DT * 2);
  assert.equal(f.state, 'recovery');
  assert.equal(game.attack(0), false); assert.equal(game.parry(0), false); assert.equal(game.dash(0), false);
  advance(game, C.recovery + DT * 2);
  assert.equal(f.state, 'idle');
  assert.equal(game.attack(0), true);
  assert.ok(hasEvent(game, 'whiff'));
});

test('a timed parry prevents death, stuns the attacker and permits an immediate punish', () => {
  const game = fresh(120);
  horizontal(game, 1); assert.equal(game.parry(0), true);
  game.resolveCombat();
  assert.equal(game.fighters[0].dead, false);
  assert.equal(game.fighters[1].state, 'stunned');
  assert.equal(game.fighters[0].state, 'idle');
  assert.deepEqual(game.score, [0, 0]); assert.ok(hasEvent(game, 'parry'));
  assert.equal(game.parry(0), false, 'successful parry must retain its cooldown');
  assert.equal(game.attack(0), true, 'success must not force missed-parry recovery');
  advance(game, .5);
  assert.equal(game.fighters[1].dead, true, 'counterattack lands before stun expires');
  assert.deepEqual(game.score, [1, 0]);
});

test('an early parry exposes its recovery and cannot be spammed', () => {
  const game = fresh(120);
  assert.equal(game.parry(0), true);
  advance(game, C.parry + DT * 2);
  assert.equal(game.fighters[0].state, 'parryRecovery');
  assert.equal(game.parry(0), false);
  assert.equal(game.attack(0), false);
  horizontal(game, 1); game.resolveCombat();
  assert.equal(game.fighters[0].dead, true);
  assert.deepEqual(game.score, [0, 1]);
  assert.match(game.lastReason, /Parry cedo/);
});

test('late parry input cannot revive a fighter after a clean hit', () => {
  const game = fresh(120); horizontal(game, 1); game.resolveCombat();
  assert.equal(game.parry(0), false);
  assert.equal(game.fighters[0].dead, true);
});

test('simultaneous natural attack arcs clash before body damage and return to neutral', () => {
  const game = fresh(145);
  assert.equal(game.attack(0), true); assert.equal(game.attack(1), true);
  advance(game, .4);
  assert.ok(hasEvent(game, 'clash'));
  assert.equal(game.fighters[0].dead, false); assert.equal(game.fighters[1].dead, false);
  assert.deepEqual(game.score, [0, 0]);
  advance(game, .3);
  assert.equal(game.fighters[0].state, 'idle'); assert.equal(game.fighters[1].state, 'idle');
});

test('dash is short, has cooldown and does not grant invulnerability', () => {
  const game = fresh(400); const startX = game.fighters[0].x;
  assert.equal(game.dash(0, 1), true);
  advance(game, C.dash + DT * 2);
  const moved = game.fighters[0].x - startX;
  assert.ok(moved > 80 && moved < 95, 'expected a short dash, actual ' + moved);
  assert.equal(game.dash(0, 1), false);
  advance(game, C.dashCooldown);
  assert.equal(game.dash(0, 1), true);
  const lethal = fresh(120); horizontal(lethal, 1);
  assert.equal(lethal.dash(0, 1), true); lethal.resolveCombat();
  assert.equal(lethal.fighters[0].dead, true);
  assert.match(lethal.lastReason, /invencibilidade/);
});

test('body separation and arena edges hold during repeated dash movement', () => {
  const game = fresh(50);
  advance(game, 3, {move: 1, dash: true});
  assert.ok(game.fighters[1].x - game.fighters[0].x >= 40 - 1e-8);
  assert.ok(game.fighters.every(f => f.x >= 95 && f.x <= 1185));
  advance(game, 12, {move: -1, dash: true});
  assert.equal(game.fighters[0].x, 95);
});

test('hitstop freezes movement and combat timers', () => {
  const game = fresh(); game.attack(0); game.hitstop = .08;
  const stateTime = game.fighters[0].stateTime, x = game.fighters[0].x, time = game.time;
  advance(game, .05, {move:1});
  assert.equal(game.fighters[0].stateTime, stateTime);
  assert.equal(game.fighters[0].x, x); assert.equal(game.time, time);
});

test('a round restarts after the dramatic pause and first to five ends the match', () => {
  const game = fresh();
  for (let point = 1; point <= 5; point++) {
    game.fighters[0].x = 500; game.fighters[1].x = 620;
    horizontal(game); game.resolveCombat();
    assert.deepEqual(game.score, [point, 0]);
    assert.equal(game.phase, 'roundEnd');
    advance(game, .9); assert.equal(game.phase, 'roundEnd');
    advance(game, .4);
    assert.equal(game.phase, point === 5 ? 'matchEnd' : 'playing');
  }
  assert.equal(game.attack(0), false);
  advance(game, 2); assert.deepEqual(game.score, [5, 0]);
  game.start(); assert.equal(game.phase, 'playing'); assert.deepEqual(game.score, [0, 0]);
  assert.equal(game.round, 1); assert.ok(game.fighters.every(f => !f.dead));
});

test('AI confirms a parry with a delayed lethal counter even during its prior attack cooldown', () => {
  const game = fresh(120);
  game.aiEnabled = true;
  game.ai.attackDelay = 10;
  game.ai.timer = 10;
  horizontal(game, 0);
  assert.equal(game.parry(1), true);
  game.resolveCombat();
  assert.equal(game.fighters[0].state, 'stunned');
  assert.equal(game.fighters[1].state, 'idle');
  advance(game, .14);
  assert.equal(game.fighters[1].state, 'idle', 'counter respects a delay after the hitstop');
  advance(game, .4);
  assert.equal(game.fighters[0].dead, true, 'AI must punish before the stun expires');
  assert.deepEqual(game.score, [0, 1]);
});

console.log('\n' + passed + ' combat rule tests passed.');
