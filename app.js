window.addEventListener('load', function () {
  const app = new PIXI.Application(700, 500, {backgroundColor: 0xffffff});
  const parent = document.querySelector('.app');
  parent.appendChild(app.view);
  PIXI.loader.add('gerald', 'master-rig.json')
    .load(onGeraldLoaded);
  function onGeraldLoaded(loader, res) {
    const gerald = new PIXI.spine.Spine(res.gerald.spineData);
    gerald.scale.set(0.3, 0.3);
    gerald.position.set(app.screen.width / 2, app.screen.height / 1.2);
    gerald.skeleton.setToSetupPose();
    gerald.state.setAnimation(0, 'DANCING-ACTIVE', false, 1);
    gerald.skeleton.setSkinByName('full-gerald');
    app.stage.addChild(gerald);
  }
  function changeAvatarSkin(skin) {
    gerald.skeleton.setSkin(null);
    gerald.skeleton.setSkinByName(skin);
  }
});
