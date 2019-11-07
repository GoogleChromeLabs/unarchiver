// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export const resultState = {
  SUCCESS: 'success',
  FAIL: 'fail',
  UNKNOWN: 'unknown',
};

export function StatusBox(props) {
  if (props.state === resultState.UNKNOWN || !props.message)
    return null;

  // Support message as either an array or a string.
  let messageList = Array.isArray(props.message) ? props.message : [props.message];

  return (
    <div id="statusBox" className={props.resultStatus}>
      { messageList.map((msg, i) => <div key={i}>{msg}</div>) }
      <style jsx>{`
      #statusBox {
        padding: 5px;
        margin: 5px;
        border-radius: 0.25em;
        min-height: 40px;
      }
      #statusBox.success {
        background-color: #aaddaf;
      }
      #statusBox.fail {
        background-color: #ffaaaa;
      }
      #statusBox div {
        display: flex;
        flex-direction: row;
        min-height: 15px;
      }
      `}</style>
    </div>
  );
}

export function statusUpdater(setStatus) {
  return {
    setSuccess: (msg) => {
      setStatus({state: resultState.SUCCESS, message: msg});
    },
    setError: (msg) => {
      setStatus({state: resultState.FAIL, message: msg});
    },
    clearStatus: () => {
      setStatus({state: resultState.UNKNOWN, message: null});
    },
  };
}
