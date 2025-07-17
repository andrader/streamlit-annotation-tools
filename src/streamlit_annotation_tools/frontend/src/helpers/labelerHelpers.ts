import { ILabel } from "../types/labelerTypes"

export const isLabeled = (
  start: number,
  end: number,
  labels: ILabel[]
): boolean => {
  return labels.some(
    (label) =>
      (start >= label.start && end <= label.end) ||
      (start <= label.start && end >= label.end) ||
      (start <= label.start && end > label.start && end <= label.end) ||
      (start >= label.start && start < label.end && end >= label.end)
  )
}

export const removeLabelData = (
  start: number,
  end: number,
  labels: ILabel[]
): ILabel[] => {
  return labels.filter(
    (label) =>
      !(start >= label.start && end <= label.end) &&
      !(start <= label.start && end >= label.end) &&
      !(start <= label.start && end > label.start && end <= label.end) &&
      !(start >= label.start && start < label.end && end >= label.end)
  )
}

export const getCharactersCountUntilNode = (
  node: Node,
  parent: HTMLElement | null
): number => {
  const walker = document.createTreeWalker(
    parent || document.body,
    NodeFilter.SHOW_TEXT,
    null
  )

  let charCount = 0
  while (walker.nextNode()) {
    if (walker.currentNode === node) {
      break
    }
    charCount += walker.currentNode.textContent?.length || 0
  }

  return charCount
}

export const adjustSelectionBounds = (
  textContent: string,
  startIndex: number,
  endIndex: number
): { start: number; end: number } => {
  let startAdjustment = 0
  let endAdjustment = 0

  const reStartIndex = /^[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g
  while (
    !(
      textContent.charAt(startIndex + startAdjustment - 1) === " " ||
      textContent.charAt(startIndex + startAdjustment - 1).match(reStartIndex)
    ) &&
    textContent.charAt(startIndex + startAdjustment - 1) !== ""
  ) {
    startAdjustment -= 1
  }

  const reEndIndex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]$/g
  while (
    !(
      textContent.charAt(endIndex + endAdjustment) === " " ||
      textContent.charAt(endIndex + endAdjustment).match(reEndIndex)
    ) &&
    textContent.charAt(endIndex + endAdjustment) !== ""
  ) {
    endAdjustment += 1
  }

  return {
    start: startIndex + startAdjustment,
    end: endIndex + endAdjustment,
  }
}

export const snakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .join("_")
    .toLowerCase()
}

export const formatKeys = (
  dict: { [key: string]: any },
  isSnakeCase: boolean
): { [key: string]: any } => {
  if (!isSnakeCase) {
    return dict
  }

  const formattedDict: { [key: string]: any } = {}
  Object.keys(dict).forEach((key) => {
    formattedDict[snakeCase(key)] = dict[key]
  })

  return formattedDict
}

// Color palette for labels
const labelColors = [
  { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500", bgLight: "bg-blue-500/20", hover: "hover:bg-blue-600" },
  { bg: "bg-green-500", border: "border-green-500", text: "text-green-500", bgLight: "bg-green-500/20", hover: "hover:bg-green-600" },
  { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-500", bgLight: "bg-purple-500/20", hover: "hover:bg-purple-600" },
  { bg: "bg-yellow-500", border: "border-yellow-500", text: "text-yellow-500", bgLight: "bg-yellow-500/20", hover: "hover:bg-yellow-600" },
  { bg: "bg-pink-500", border: "border-pink-500", text: "text-pink-500", bgLight: "bg-pink-500/20", hover: "hover:bg-pink-600" },
  { bg: "bg-indigo-500", border: "border-indigo-500", text: "text-indigo-500", bgLight: "bg-indigo-500/20", hover: "hover:bg-indigo-600" },
  { bg: "bg-red-500", border: "border-red-500", text: "text-red-500", bgLight: "bg-red-500/20", hover: "hover:bg-red-600" },
  { bg: "bg-teal-500", border: "border-teal-500", text: "text-teal-500", bgLight: "bg-teal-500/20", hover: "hover:bg-teal-600" },
  { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500", bgLight: "bg-orange-500/20", hover: "hover:bg-orange-600" },
  { bg: "bg-cyan-500", border: "border-cyan-500", text: "text-cyan-500", bgLight: "bg-cyan-500/20", hover: "hover:bg-cyan-600" },
]

export const getLabelColor = (labelName: string, labelIndex: number) => {
  return labelColors[labelIndex % labelColors.length]
}

export const getLabelColorByName = (labelName: string, labelNames: string[]) => {
  const index = labelNames.indexOf(labelName)
  return getLabelColor(labelName, index)
}
