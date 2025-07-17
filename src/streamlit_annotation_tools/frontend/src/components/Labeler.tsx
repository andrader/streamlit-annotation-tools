import React, { useReducer, useEffect, useCallback, useState, useRef } from "react"
import { Streamlit } from "streamlit-component-lib"
import { useRenderData } from "../utils/StreamlitProvider"
import { ActionTypes, IAction, IState } from "../types/labelerTypes"
import { initialState, reducer } from "../reducers/labelerReducer"
import { adjustSelectionBounds, getCharactersCountUntilNode, isLabeled, removeLabelData, getLabelColor } from "../helpers/labelerHelpers"

const Labeler: React.FC = () => {
  const { args } = useRenderData()
  const [labelName, setLabelName] = useState<string>("")
  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(
    reducer,
    initialState
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { text, labels, in_snake_case } = args
      dispatch({ type: ActionTypes.SET_TEXT_LABELS, payload: { text, labels, in_snake_case } })
      dispatch({ type: ActionTypes.RENDER_TEXT })
      Streamlit.setComponentValue(labels)
    }

    fetchData()
  }, [])

  useEffect(() => {
    dispatch({ type: ActionTypes.RENDER_TEXT })
  }, [state.labels, state.selectedLabel])

  // Adjust component height when content changes
  useEffect(() => {
    const adjustHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight
        Streamlit.setFrameHeight(height + 20) // Add some padding
      }
    }
    
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(adjustHeight, 10)
    return () => clearTimeout(timeoutId)
  }, [state.labels, state.actual_text, state.selectedLabel])

  const handleMouseUp = useCallback(async () => {
    if (!state.selectedLabel) return
    const selection = document.getSelection()?.getRangeAt(0);

    if (selection && selection.toString().trim() !== "") {
      const container = document.getElementById("actual-text");
      const charsBeforeStart = getCharactersCountUntilNode(selection.startContainer, container);
      const charsBeforeEnd = getCharactersCountUntilNode(selection.endContainer, container);

      const finalStartIndex = selection.startOffset + charsBeforeStart;
      const finalEndIndex = selection.endOffset + charsBeforeEnd;

      const textContent = container?.textContent || "";

      const { start, end } = adjustSelectionBounds(textContent, finalStartIndex, finalEndIndex);
      const selectedText = textContent.slice(start, end);

      if (isLabeled(finalStartIndex, finalEndIndex, state.labels[state.selectedLabel])) {
        const labels = removeLabelData(start, end, state.labels[state.selectedLabel]);
        const newLabels = { ...state.labels };
        newLabels[state.selectedLabel] = labels;
        dispatch({ type: ActionTypes.SET_TEXT_LABELS, payload: { text: state.text, labels: newLabels, in_snake_case: state.in_snake_case } });
      } else {
        const label = { start, end, label: selectedText };
        const newLabels = { ...state.labels };
        newLabels[state.selectedLabel] = [...newLabels[state.selectedLabel], label];
        dispatch({ type: ActionTypes.SET_TEXT_LABELS, payload: { text: state.text, labels: newLabels, in_snake_case: state.in_snake_case } });
      }
    }
  }, [state, dispatch]);

  const addLabel = (name: string) => {
    if (name.trim() === "" || args.allow_new_labels === false) return

    setLabelName("")
    dispatch({ type: ActionTypes.ADD_LABEL, payload: name })
  }

  const selectLabel = (name: string) => {
    dispatch({ type: ActionTypes.SELECT_LABEL, payload: name })
  }

  const removeLabel = (name: string) => {
    if (args.allow_new_labels === false) return
    dispatch({ type: ActionTypes.REMOVE_LABEL, payload: name })
  }

  return (
    <div ref={containerRef}>
      <div className="flex flex-row flex-wrap">
        {args.allow_new_labels !== false && (
          <div className="flex flex-wrap justify-between items-center cursor-pointer mr-2 mb-2 pr-3 rounded text-white text-base bg-primary hover:bg-secondary">
            <input
              type="text"
              placeholder="Enter Label Name"
              className="text-black p-1 mr-2 focus:outline-none border border-secondary"
              onChange={(e) => setLabelName(e.target.value)}
              value={labelName}
            />
            <button onClick={() => addLabel(labelName)}>Add Label</button>
          </div>
        )}

        {Object.keys(state.labels).map((label, index) => {
          const labelColor = getLabelColor(label, index)
          return (
            <span
              key={index}
              className={
                "flex flex-wrap justify-between items-center cursor-pointer py-1 px-3 mr-2 mb-2 rounded text-base" +
                (state.selectedLabel === label
                  ? ` ${labelColor.bg} ${labelColor.hover} text-white`
                  : ` border ${labelColor.border} ${labelColor.text} hover:${labelColor.bg} hover:text-white`)
              }
              onClick={() => selectLabel(label)}
            >
              {label}
              {args.allow_new_labels !== false && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-3 hover:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={() => removeLabel(label)}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  />
                </svg>
              )}
            </span>
          )
        })}
      </div>
      <div id="actual-text" className="mt-5 min-h-0" onMouseUp={handleMouseUp}>
        {state.actual_text}
      </div>
    </div>
  )
}

export default Labeler
