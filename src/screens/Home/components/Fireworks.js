import React from "react";
import Proton from "proton-engine";
import RAFManager from "raf-manager";
import Canvas from "react-native-particles-bg/src/particles/Canvas";

export default class Fireworks extends React.Component {
  constructor(props) {
    super(props);
    this.renderProton = this.renderProton.bind(this);
  }

  handleCanvasInited(canvas) {
    this.createProton(canvas);
    RAFManager.add(this.renderProton);
  }

  componentWillUnmount() {
    try {
      RAFManager.remove(this.renderProton);
      this.proton.destroy();
    } catch (e) {}
  }

  createProton(canvas) {
    const proton = new Proton();
    const emitter = new Proton.Emitter();
    emitter.rate = new Proton.Rate(new Proton.Span(1, 3), 1);

    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.Radius(2, 4));
    emitter.addInitialize(
      new Proton.P(
        new Proton.LineZone(10, canvas.height, canvas.width - 10, canvas.height)
      )
    );
    emitter.addInitialize(new Proton.Life(1, 1.5));
    emitter.addInitialize(
      new Proton.V(new Proton.Span(4, 6), new Proton.Span(0, 0, true), "polar")
    );

    emitter.addBehaviour(new Proton.Gravity(1));
    emitter.addBehaviour(new Proton.Color("#ff0000", "random"));
    emitter.emit();
    proton.addEmitter(emitter);

    const renderer = new Proton.CanvasRenderer(canvas);
    const context = canvas.getContext("2d");
    renderer.onProtonUpdate = function() {
      context.fillStyle = "rgba(0, 0, 0, 0.02)";
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    proton.addRenderer(renderer);

    //// NOTICE :you can only use two emitters do this effect.In this demo I use more emitters want to test the emtter's life
    proton.addEventListener(Proton.PARTICLE_DEAD, particle => {
      if (Math.random() < 0.7) this.createFirstEmitter(particle);
      else this.createSecondEmitter(particle);
    });

    this.proton = proton;
    this.renderer = renderer;
  }

  createFirstEmitter(particle) {
    const subemitter = new Proton.Emitter();
    subemitter.rate = new Proton.Rate(new Proton.Span(250, 300), 1);
    subemitter.addInitialize(new Proton.Mass(1));
    subemitter.addInitialize(new Proton.Radius(1, 2));
    subemitter.addInitialize(new Proton.Life(1, 3));
    subemitter.addInitialize(
      new Proton.V(new Proton.Span(2, 4), new Proton.Span(0, 360), "polar")
    );

    subemitter.addBehaviour(new Proton.RandomDrift(10, 10, 0.05));
    subemitter.addBehaviour(new Proton.Alpha(1, 0));
    subemitter.addBehaviour(new Proton.Gravity(3));
    const color =
      Math.random() > 0.3 ? Proton.MathUtil.randomColor() : "random";
    subemitter.addBehaviour(new Proton.Color(color));

    subemitter.p.x = particle.p.x;
    subemitter.p.y = particle.p.y;
    subemitter.emit("once", true);
    this.proton.addEmitter(subemitter);
  }

  createSecondEmitter(particle) {
    const subemitter = new Proton.Emitter();
    subemitter.rate = new Proton.Rate(new Proton.Span(100, 120), 1);

    subemitter.addInitialize(new Proton.Mass(1));
    subemitter.addInitialize(new Proton.Radius(4, 8));
    subemitter.addInitialize(new Proton.Life(1, 2));
    subemitter.addInitialize(
      new Proton.V([1, 2], new Proton.Span(0, 360), "polar")
    );

    subemitter.addBehaviour(new Proton.Alpha(1, 0));
    subemitter.addBehaviour(new Proton.Scale(1, 0.1));
    subemitter.addBehaviour(new Proton.Gravity(1));
    const color = Proton.MathUtil.randomColor();
    subemitter.addBehaviour(new Proton.Color(color));

    subemitter.p.x = particle.p.x;
    subemitter.p.y = particle.p.y;
    subemitter.emit("once", true);
    this.proton.addEmitter(subemitter);
    console.log(1);
  }

  handleResize(width, height) {
    this.renderer.resize(width, height);
  }

  renderProton() {
    this.proton.update();
    this.proton.stats.update(2);
  }

  render() {
    return (
      <Canvas
        bg = {this.props.bg}
        onCanvasInited={this.handleCanvasInited.bind(this)}
        onResize={this.handleResize.bind(this)}
      />
    );
  }
}