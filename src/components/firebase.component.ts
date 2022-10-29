import {Binding, Component, ProviderMap} from '@loopback/core';
import {FirebaseBindings} from '../keys';
import {FirebaseProvider} from '../providers/';

export class FirebaseComponent implements Component {
  constructor() {}

  providers?: ProviderMap | undefined = {
    [FirebaseBindings.FirebaseProvider.key]: FirebaseProvider,
  };

  bindings: Binding[] = [Binding.bind(FirebaseBindings.Config.key).to(null)];
}
