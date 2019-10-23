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
