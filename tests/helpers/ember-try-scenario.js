export default function emberTryScenario(version) {
  return {
    scenarioName: `ember-${version}`,
    passed: true,
    allowedToFail: false,
    dependencies: [
      {
        name: 'ember-source',
        versionSeen: `${version}.2`,
        versionExpected: `${version}.0`,
        type: 'yarn'
      }
    ]
  };
}
