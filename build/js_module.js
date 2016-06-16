'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['contracts'] = (function builder () {
  var environments = {
      'default': {
        'objects': {
          'registry': {
            'class': 'AkashaRegistry',
            'address': '0x41082279ed8dbfc43e1a36015ee57757ae9b228b'
          },
          'helper': {
            'class': 'AkashaLib',
            'address': '0x763680c410cc7118fe7847ab4367d8125ea89423'
          },
          'tags': {
            'class': 'AkashaTags',
            'address': '0x38a2819d0f0da5de22a8d91e4605deb0b9676407'
          },
          'indexedTags': {
            'class': 'IndexedTags',
            'address': '0x1befa768ff9aad029fe7d3d2913eae14a9c344f2'
          },
          'badges': {
            'class': 'AkashaBadges',
            'address': '0xc06a17c6a10c5afc4c496ecbb3bc0946102c195b'
          }
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'registry': {
          'class': 'AkashaRegistry',
          'address': '0x41082279ed8dbfc43e1a36015ee57757ae9b228b'
        },
        'helper': {
          'class': 'AkashaLib',
          'address': '0x763680c410cc7118fe7847ab4367d8125ea89423'
        },
        'tags': {
          'class': 'AkashaTags',
          'address': '0x38a2819d0f0da5de22a8d91e4605deb0b9676407'
        },
        'indexedTags': {
          'class': 'IndexedTags',
          'address': '0x1befa768ff9aad029fe7d3d2913eae14a9c344f2'
        },
        'badges': {
          'class': 'AkashaBadges',
          'address': '0xc06a17c6a10c5afc4c496ecbb3bc0946102c195b'
        }
      }
    };
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'AkashaBadges': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': '_knownBadges',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              }
            ],
            'name': 'getBadge',
            'outputs': [
              {
                'name': 'first',
                'type': 'bytes32'
              },
              {
                'name': 'second',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              },
              {
                'name': 'hash',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'createBadge',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              }
            ],
            'name': 'badgeExists',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61046a8061003f6000396000f360606040523615610069576000357c010000000000000000000000000000000000000000000000000000000090048063676c20481461007657806377002fcf146100a657806383197ef0146100e1578063ae94ebd1146100f0578063af4bd7431461014c57610069565b6100745b610002565b565b005b61008c600480803590602001909190505061017a565b604051808260001916815260200191505060405180910390f35b6100bc600480803590602001909190505061019f565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6100ee6004805050610211565b005b6101346004808035906020019091908060400190600280602002604051908101604052809291908260026020028082843782019150505050509090919050506102aa565b60405180821515815260200191505060405180910390f35b610162600480803590602001909190505061041d565b60405180821515815260200191505060405180910390f35b600260005081815481101561000257906000526020600020900160005b915090505481565b600060006001600050600084600019168152602001908152602001600020600050600060028110156100025790900160005b50546001600050600085600019168152602001908152602001600020600050600160028110156100025790900160005b50549150915061020c565b915091565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561026d57610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561030857610002565b6103118361041d565b1561031f5760009050610417565b81600160005060008560001916815260200190815260200160002060005090600282600290908101928215610374579160200282015b82811115610373578251826000505591602001919060010190610355565b5b50905061039f9190610381565b8082111561039b5760008181506000905550600101610381565b5090565b5050600260005080548060010182818154818355818115116103f3578183600052602060002091820191016103f291906103d4565b808211156103ee57600081815060009055506001016103d4565b5090565b5b5050509190906000526020600020900160005b859091909150555060019050610417565b92915050565b60006000600102600019166001600050600084600019168152602001908152602001600020600050600060028110156100025790900160005b50546000191614159050610465565b91905056'
      },
      'AkashaBase': {
        'interface': [
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61014b8061003f6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806383197ef014610044578063b2bdfa7b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610125565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156100e857610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'AkashaEntry': {
        'interface': [
          {
            'inputs': [
              {
                'name': 'hash',
                'type': 'bytes32[2]'
              },
              {
                'name': 'tags',
                'type': 'bytes32[]'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '606060405260405160ce38038060ce8339810160405280908160400180518201919060200150505b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600060005090600282600290908101928215608c579160200282015b82811115608b578251826000505591602001919060010190606f565b5b50905060b391906097565b8082111560af57600081815060009055506001016097565b5090565b50505b5050600a8060c46000396000f360606040526008565b00'
      },
      'AkashaLib': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'first',
                'type': 'bytes32'
              },
              {
                'name': 'second',
                'type': 'bytes32'
              }
            ],
            'name': 'getIpfs',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'chunk',
                'type': 'bytes32'
              }
            ],
            'name': 'bytes32ToString',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6105868061003f6000396000f360606040523615610053576000357c01000000000000000000000000000000000000000000000000000000009004806353ef4a531461006057806383197ef0146100ed5780639201de55146100fc57610053565b61005e5b610002565b565b005b61007f6004808035906020019091908035906020019091905050610180565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156100df5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100fa60048050506101ca565b005b6101126004808035906020019091905050610263565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101725780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60206040519081016040528060008152602001506101bd6101a6836000191661029c9090565b6101b5856000191661029c9090565b6102e8909190565b90506101c4565b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561022657610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6020604051908101604052806000815260200150610290610289836000191661029c9090565b61037f9090565b9050610297565b919050565b60406040519081016040528060008152602001600081526020015060405160208101604052828152806020830152506102d4826103f6565b81600001909081815260200150505b919050565b602060405190810160405280600081526020015060206040519081016040528060008152602001506000836000015185600001510160405180591061032a5750595b908082528060200260200182016040525091506020820190506103568186602001518760000151610533565b61036f8560000151820185602001518660000151610533565b819250610377565b505092915050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600083600001516040518059106103bb5750595b908082528060200260200182016040525091506020820190506103e78185602001518660000151610533565b8192506103ef565b5050919050565b60006000600060010283600019161415610413576000915061052d565b60006001026fffffffffffffffffffffffffffffffff6001028416600019161415610460576010810190508050700100000000000000000000000000000000836001900404600102925082505b600060010267ffffffffffffffff600102841660001916141561049d57600881019050805068010000000000000000836001900404600102925082505b600060010263ffffffff60010284166000191614156104d2576004810190508050640100000000836001900404600102925082505b600060010261ffff600102841660001916141561050357600281019050805062010000836001900404600102925082505b600060010260ff60010284166000191614156105225760018101905080505b80602003915061052d565b50919050565b60005b6020821015156105625782518452602084019350835060208301925082505b6020820391508150610536565b6001826020036101000a039050801983511681855116818117865250505b5050505056'
      },
      'AkashaMain': {
        'interface': [
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'registryAddress',
                'type': 'address'
              },
              {
                'name': 'indexAddress',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604051604080610234833981016040528080519060200190919080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b81600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555033600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b505061014b806100e96000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806383197ef014610044578063b2bdfa7b1461005357610042565b005b610051600480505061008c565b005b6100606004805050610125565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156100e857610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'AkashaProfile': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'getCollector',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newAddr',
                'type': 'address'
              }
            ],
            'name': 'setEthAddress',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'chunks',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'setHash',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getIpfs',
            'outputs': [
              {
                'name': 'chunk1',
                'type': 'bytes32'
              },
              {
                'name': 'chunk2',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              },
              {
                'name': 'registrar',
                'type': 'address'
              },
              {
                'name': 'chunks',
                'type': 'bytes32[2]'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [],
            'name': 'UpdateInfo',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260405160808061065f8339810160405280805190602001909190805190602001909190908160400150505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b82600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806002600050906002826002909081019282156100c4579160200282015b828111156100c35782518260005055916020019190600101906100a5565b5b5090506100ef91906100d1565b808211156100eb57600081815060009055506001016100d1565b5090565b505081915081505b505050610557806101086000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063502282011461008157806383197ef0146100ba5780639b0da5d5146100c9578063a5685446146100e1578063b2bdfa7b1461011e578063f8dd5af51461015757610074565b61007f5b610002565b565b005b61008e6004805050610189565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100c7600480505061023a565b005b6100df600480803590602001909190505061036c565b005b61011c6004808060400190600280602002604051908101604052809291908260026020028082843782019150505050509090919050506103f7565b005b61012b60048050506104f0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101646004805050610516565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561020d57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610237565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610237565b90565b60003373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561029857610002565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f11561000257505050604051805190602001509050801561036857600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103c857610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561045357610002565b80600260005090600282600290908101928215610490579160200282015b8281111561048f578251826000505591602001919060010190610471565b5b5090506104bb919061049d565b808211156104b7576000818150600090555060010161049d565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006002600050600060028110156100025790900160005b50546002600050600160028110156100025790900160005b505491509150610553565b909156'
      },
      'AkashaRegistry': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'getMyProfile',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'getByAddr',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'getById',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'ipfsChunks',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'register',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'hasProfile',
            'outputs': [
              {
                'name': 'exists',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'unregister',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'contr',
                'type': 'address'
              }
            ],
            'name': 'Register',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610e368061003f6000396000f36060604052361561008a576000357c01000000000000000000000000000000000000000000000000000000009004806321527e5014610097578063259a1a34146100d05780632dff0d0d1461011257806330d000121461015457806383197ef0146101b0578063ad4b7cb1146101bf578063b2bdfa7b146101ed578063e79a198f146102265761008a565b6100955b610002565b565b005b6100a4600480505061024b565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100e66004808035906020019091905050610260565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101286004808035906020019091905050610300565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610198600480803590602001909190806040019060028060200260405190810160405280929190826002602002808284378201915050505050909091905050610349565b60405180821515815260200191505060405180910390f35b6101bd6004805050610594565b005b6101d5600480803590602001909190505061062d565b60405180821515815260200191505060405180910390f35b6101fa60048050506106b4565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61023360048050506106da565b60405180821515815260200191505060405180910390f35b600061025633610260565b905061025d565b90565b6000600160005060006002600050600085604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000505460001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506102fb565b919050565b6000600160005060008360001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610344565b919050565b60006103548361062d565b156103e2577f52656769737472793a7265676973746572000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f68617350726f66696c6500000000000000000000000000000000000000000000604051808260001916815260200191505060405180910390a26000905061058e565b33308360405161065f806107d7833901808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001826002602002808383829060006004602084601f0104600f02600301f1509050019350505050604051809103906000f0600160005060008560001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550826002600050600033604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000508190555082600019167f1082cda15f9606da555bb7e9bf4eeee2f8e34abe85d3924bf9bacb716f8feca6600160005060008660001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a26001905061058e565b92915050565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156105f057610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600073ffffffffffffffffffffffffffffffffffffffff1661065083610300565b73ffffffffffffffffffffffffffffffffffffffff161415806106a85750600073ffffffffffffffffffffffffffffffffffffffff1661068f33610260565b73ffffffffffffffffffffffffffffffffffffffff1614155b90506106af565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600033604051808273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019150506040518091039020905061074160026000506000836000191681526020019081526020016000206000505461062d565b156107ca576001600050600060026000506000846000191681526020019081526020016000206000505460001916815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600260005060008260001916815260200190815260200160002060005060009055600191506107d3565b600091506107d3565b509056606060405260405160808061065f8339810160405280805190602001909190805190602001909190908160400150505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b82600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806002600050906002826002909081019282156100c4579160200282015b828111156100c35782518260005055916020019190600101906100a5565b5b5090506100ef91906100d1565b808211156100eb57600081815060009055506001016100d1565b5090565b505081915081505b505050610557806101086000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063502282011461008157806383197ef0146100ba5780639b0da5d5146100c9578063a5685446146100e1578063b2bdfa7b1461011e578063f8dd5af51461015757610074565b61007f5b610002565b565b005b61008e6004805050610189565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100c7600480505061023a565b005b6100df600480803590602001909190505061036c565b005b61011c6004808060400190600280602002604051908101604052809291908260026020028082843782019150505050509090919050506103f7565b005b61012b60048050506104f0565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101646004805050610516565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561020d57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610237565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610237565b90565b60003373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561029857610002565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f11561000257505050604051805190602001509050801561036857600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156103c857610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561045357610002565b80600260005090600282600290908101928215610490579160200282015b8281111561048f578251826000505591602001919060010190610471565b5b5090506104bb919061049d565b808211156104b7576000818150600090555060010161049d565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060006002600050600060028110156100025790900160005b50546002600050600160028110156100025790900160005b505491509150610553565b909156'
      },
      'AkashaTags': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'exists',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'add',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'getTagId',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'position',
                'type': 'uint256'
              }
            ],
            'name': 'getTagAt',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_length',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'TagCreated',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260016003600050555b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61049d806100476000396000f36060604052361561007f576000357c01000000000000000000000000000000000000000000000000000000009004806338a699a41461008c578063446bffba146100ba5780636d74e7ab146100e657806383197ef014610112578063b2bdfa7b14610121578063d857eba61461015a578063fa2b42811461018a5761007f565b61008a5b610002565b565b005b6100a260048080359060200190919050506101ad565b60405180821515815260200191505060405180910390f35b6100d060048080359060200190919050506101dd565b6040518082815260200191505060405180910390f35b6100fc600480803590602001909190505061037c565b6040518082815260200191505060405180910390f35b61011f60048050506103a8565b005b61012e6004805050610441565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101706004808035906020019091905050610467565b604051808260001916815260200191505060405180910390f35b6101976004805050610494565b6040518082815260200191505060405180910390f35b60006000600160005060008460001916815260200190815260200160002060005054141590506101d8565b919050565b60006101e8826101ad565b15610276577f5461673a61646400000000000000000000000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f6578697374730000000000000000000000000000000000000000000000000000604051808260001916815260200191505060405180910390a260009050610377565b600260005080548060010182818154818355818115116102c8578183600052602060002091820191016102c791906102a9565b808211156102c357600081815060009055506001016102a9565b5090565b5b5050509190906000526020600020900160005b8490919091505550600360005054600160005060008460001916815260200190815260200160002060005081905550600360008181505480929190600101919050555081600019167f2cbbbefb5b1acf02521fecc3ca9bbb887bdd88549017993f7fffa8e5bc27cc6860405180905060405180910390a26001600050600083600019168152602001908152602001600020600050549050610377565b919050565b600060016000506000836000191681526020019081526020016000206000505490506103a3565b919050565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561040457610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260005082815481101561000257906000526020600020900160005b5054905061048f565b919050565b6003600050548156'
      },
      'IndexedTags': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'subscribe',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'subscriber',
                'type': 'address'
              },
              {
                'name': 'tagId',
                'type': 'uint256'
              }
            ],
            'name': 'isSubscribed',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              },
              {
                'name': 'subPosition',
                'type': 'uint256'
              }
            ],
            'name': 'unsubscribe',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'subscriber',
                'type': 'address'
              },
              {
                'name': 'tagId',
                'type': 'uint256'
              }
            ],
            'name': 'getSubPosition',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'mainAddress',
                'type': 'address'
              }
            ],
            'name': 'setMain',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'cursor',
            'outputs': [
              {
                'name': 'totalSubs',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32[]'
              }
            ],
            'name': 'indexEntry',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'tags',
                'type': 'address'
              },
              {
                'name': 'registry',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'tag',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'entry',
                'type': 'address'
              }
            ],
            'name': 'IndexedTag',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'method',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'reason',
                'type': 'bytes32'
              }
            ],
            'name': 'Error',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526040516040806111c1833981016040528080519060200190919080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50506110d8806100e96000396000f360606040523615610095576000357c0100000000000000000000000000000000000000000000000000000000900480632faf44f6146100a257806336867ae6146100d057806340f745661461010757806376831c221461013e578063801161b01461017357806383197ef01461018b57806392cd94791461019a578063b2bdfa7b146101c6578063d88802fe146101ff57610095565b6100a05b610002565b565b005b6100b86004808035906020019091905050610268565b60405180821515815260200191505060405180910390f35b6100ef60048080359060200190919080359060200190919050506105fb565b60405180821515815260200191505060405180910390f35b61012660048080359060200190919080359060200190919050506106b5565b60405180821515815260200191505060405180910390f35b61015d6004808035906020019091908035906020019091905050610a9a565b6040518082815260200191505060405180910390f35b6101896004808035906020019091905050610b4b565b005b6101986004805050610bd6565b005b6101b06004808035906020019091905050610c6f565b6040518082815260200191505060405180910390f35b6101d36004805050610c93565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61025060048080359060200190820180359060200191919080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050909091905050610cb9565b60405180821515815260200191505060405180910390f35b600060006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab85604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509150600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663259a1a3433604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806104875750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a485604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150155b80610498575061049781836105fb565b5b15610526577f5461673a73756273637269626500000000000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f6973537562736372696265640000000000000000000000000000000000000000604051808260001916815260200191505060405180910390a2600092506105f4565b600560005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060010182818154818355818115116105a2578183600052602060002091820191016105a19190610583565b8082111561059d5760008181506000905550600101610583565b5090565b5b5050509190906000526020600020900160005b849091909150555060046000506000838152602001908152602001600020600050600101600081815054809291906001019190505550600192506105f4565b5050919050565b60006000600090505b600560005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508110156106a55782600560005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b5054141561069757600191506106ae565b5b8080600101915050610604565b600091506106ae565b5092915050565b600060006000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab86604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509150600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663259a1a3433604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a486604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150151561092b577f5461673a756e7375627363726962650000000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f7461672145786973740000000000000000000000000000000000000000000000604051808260001916815260200191505060405180910390a260009250610a92565b81600560005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005085815481101561000257906000526020600020900160005b5054141515610a05577f5461673a756e7375627363726962650000000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f6e6f745375627363726962656400000000000000000000000000000000000000604051808260001916815260200191505060405180910390a260009250610a92565b600560005060008273ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050610a3e8284610a9a565b815481101561000257906000526020600020900160005b5060009055600460005060008381526020019081526020016000206000506001016000818150548092919060019003919050555060019250610a92565b505092915050565b60006000600090505b600560005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050811015610b435782600560005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b50541415610b3557809150610b44565b5b8080600101915050610aa3565b5b5092915050565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610ba757610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b3373ffffffffffffffffffffffffffffffffffffffff16600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610c3257610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b60046000506020528060005260406000206000915090508060010160005054905081565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610d1957610002565b600090505b82518110156110c957600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a4848381518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001501515610e63577f5461673a696e6465780000000000000000000000000000000000000000000000600019167f20b95d47989a103df33423e539efac0be3fa8e6fd61af19d24050e331fe94f657f696e646578456e74727900000000000000000000000000000000000000000000604051808260001916815260200191505060405180910390a2600091506110d2565b60046000506000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab868581518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015081526020019081526020016000206000506000016000508054806001018281815481835581811511610f7b57818360005260206000209182019101610f7a9190610f5c565b80821115610f765760008181506000905550600101610f5c565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550507f65e16ab7c9339d87377d6ad2c9233e53671562d663c9f30ee6a8dd861b8a1580600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab858481518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015033604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b8080600101915050610d1e565b600191506110d2565b5091905056'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['contracts'];
}
