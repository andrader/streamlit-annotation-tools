import { Streamlit } from "streamlit-component-lib"
import { ActionTypes, IAction, IState } from "../types/labelerTypes"
import React from "react"
import { formatKeys, getLabelColorByName } from "../helpers/labelerHelpers"

// Define the initial state of the component
export const initialState: IState = {
  text: "",
  actual_text: [],
  labels: {},
  selectedLabel: "",
  in_snake_case: false,
  showAllLabels: false,
}

// Reducer function to handle state transitions
export const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case ActionTypes.SET_TEXT_LABELS:
      Streamlit.setComponentValue(formatKeys(action.payload.labels, action.payload.in_snake_case))

      return {
        ...state,
        in_snake_case: action.payload.in_snake_case,
        text: action.payload.text,
        labels: action.payload.labels,
        showAllLabels: action.payload.show_all_labels ?? state.showAllLabels,
      }

    case ActionTypes.RENDER_TEXT:
      const { text, labels, showAllLabels } = state
      const actual_text: JSX.Element[] = []
      let selectedLabel = state.selectedLabel

      if (!selectedLabel) {
        if (Object.keys(labels).length > 0) {
          selectedLabel = Object.keys(labels)[0]
        } else {
          return {
            ...state,
            actual_text: [<p key={"default-text"}>{text}</p>]
          }
        }
      }

      if (!labels[selectedLabel]) {
        selectedLabel = Object.keys(labels)[Object.keys(labels).length - 1]
      }

      const labelNames = Object.keys(labels)

      if (showAllLabels) {
        // Collect all labels from all categories with their category info
        const allLabels: Array<{ start: number; end: number; label: string; category: string; color: any }> = []
        
        labelNames.forEach((category) => {
          const categoryColor = getLabelColorByName(category, labelNames)
          labels[category]?.forEach((label) => {
            allLabels.push({
              ...label,
              category,
              color: categoryColor
            })
          })
        })

        // Sort all labels by start position
        allLabels.sort((a, b) => a.start - b.start)

        // Create a list of events (start and end positions)
        const events: Array<{ pos: number; type: 'start' | 'end'; label: any }> = []
        allLabels.forEach((label) => {
          events.push({ pos: label.start, type: 'start', label })
          events.push({ pos: label.end, type: 'end', label })
        })

        // Sort events by position, with end events before start events at the same position
        events.sort((a, b) => {
          if (a.pos !== b.pos) return a.pos - b.pos
          return a.type === 'end' ? -1 : 1
        })

        // Build the rendered text with nested spans
        let currentPos = 0
        const activeLabels: Array<any> = []
        
        events.forEach((event, eventIndex) => {
          // Add unlabeled text before this event
          if (currentPos < event.pos) {
            if (activeLabels.length === 0) {
              actual_text.push(
                <span key={`unlabeled-${eventIndex}`}>
                  {text.substring(currentPos, event.pos)}
                </span>
              )
            } else {
              // Text is inside active labels
              const topLabel = activeLabels[activeLabels.length - 1]
              actual_text.push(
                <span
                  key={`labeled-${eventIndex}`}
                  className={`labeled border ${topLabel.color.border} ${topLabel.color.bgLight}`}
                  title={topLabel.category}
                >
                  {text.substring(currentPos, event.pos)}
                </span>
              )
            }
          }

          // Handle the event
          if (event.type === 'start') {
            activeLabels.push(event.label)
          } else {
            const index = activeLabels.findIndex(l => l === event.label)
            if (index !== -1) {
              activeLabels.splice(index, 1)
            }
          }

          currentPos = event.pos
        })

        // Add remaining unlabeled text
        if (currentPos < text.length) {
          if (activeLabels.length === 0) {
            actual_text.push(
              <span key="unlabeled-end">{text.substring(currentPos)}</span>
            )
          } else {
            const topLabel = activeLabels[activeLabels.length - 1]
            actual_text.push(
              <span
                key="labeled-end"
                className={`labeled border ${topLabel.color.border} ${topLabel.color.bgLight}`}
                title={topLabel.category}
              >
                {text.substring(currentPos)}
              </span>
            )
          }
        }
      } else {
        // Single label mode (original logic)
        let start = 0
        const labelColor = getLabelColorByName(selectedLabel, labelNames)

        labels[selectedLabel]
          ?.sort((a, b) => a.start - b.start)
          .forEach((label, index) => {
            actual_text.push(
              <span key={`unlabeled-${index}`}>
                {text.substring(start, label.start)}
              </span>
            )
            actual_text.push(
              <span
                key={`labeled-${index}`}
                className={`labeled border ${labelColor.border} ${labelColor.bgLight}`}
              >
                {text.substring(label.start, label.end)}
              </span>
            )
            start = label.end
          })
        actual_text.push(
          <span key="unlabeled-end">{text.substring(start)}</span>
        )
      }

      Streamlit.setComponentValue(formatKeys(labels, state.in_snake_case))
      return {
        ...state,
        actual_text,
        selectedLabel,
      }

    case ActionTypes.ADD_LABEL:
      const newLabels = { ...state.labels }
      // strip whitespace
      newLabels[action.payload.trim()] = []

      return {
        ...state,
        labels: newLabels,
        selectedLabel: action.payload,
      }

    case ActionTypes.SELECT_LABEL:
      return {
        ...state,
        selectedLabel: action.payload,
      }

    case ActionTypes.REMOVE_LABEL:
      const updatedLabels = { ...state.labels }
      delete updatedLabels[action.payload]

      return {
        ...state,
        labels: updatedLabels
      }

    default:
      return state
  }
}
