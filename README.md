<h1> streamlit-annotation </h1>

> **Note**: This is a fork of [rmarquet21/streamlit-annotation-tools](https://github.com/rmarquet21/streamlit-annotation-tools). All credit goes to the original author Robin Marquet.

- [Streamlit Annotation Tools](#streamlit-annotation-tools)
- [What's New in This Fork](#whats-new-in-this-fork)
- [Installation](#installation)
  - [From GitHub (Recommended)](#from-github-recommended)
  - [For Development](#for-development)
- [Demo](#demo)
  - [Try](#try)
  - [Text Highlighter](#text-highlighter)
  - [Text Labeler](#text-labeler)
- [Quick Use](#quick-use)
  - [Text Highlighter](#text-highlighter-1)
  - [Text Labeler](#text-labeler-1)
- [Development](#development)
  - [Install](#install-1)
  - [Run](#run)
- [License](#license)
- [Author](#author)
- [Contributors](#contributors)

# Streamlit Annotation Tools

Streamlit Annotation Tools is a Streamlit component that gives you access to various annotation tools (labeling, annotation, etc.) for text data.

# What's New in This Fork

This fork includes several enhancements and improvements over the original repository:

## 🚀 **New Features**

### Text Labeler Enhancements
- **Show All Labels Simultaneously**: Display all labels from all categories at once with `show_all_labels=True`
- **Label Creation Control**: Option to allow or restrict new label creation with `allow_new_labels` parameter
- **Dynamic Height Adjustment**: Labeler component now automatically adjusts height based on content
- **Dynamic Label Colors**: Enhanced visual experience with improved color management for labels

### Build System Improvements
- **Migrated from Poetry to Hatch**: More modern and efficient build system
- **UV Lock File**: Faster dependency resolution and installation
- **Improved Package Management**: Better dependency organization and development workflow

## 📋 **Detailed Changes**

| Feature                | Description                                 | Commit    |
| ---------------------- | ------------------------------------------- | --------- |
| Show All Labels        | Display all label categories simultaneously | `a85ed9b` |
| Label Creation Control | Allow/restrict new label creation           | `d981d0d` |
| Dynamic Height         | Auto-adjust component height                | `af80eae` |
| Dynamic Colors         | Enhanced label color management             | `c732d73` |
| Build System           | Poetry → Hatch migration                    | `be39456` |

# Installation

## From GitHub (Recommended)

Since this is a fork and not published to PyPI, install directly from GitHub:

```bash
pip install git+https://github.com/andrader/streamlit-annotation-tools.git
```

## For Development

Clone the repository and install in development mode:

```bash
git clone https://github.com/andrader/streamlit-annotation-tools.git
cd streamlit-annotation-tools
pip install -e .
```

### Prerequisites

- Python 3.12+
- Node.js (for frontend development)

# Demo

## Try
[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://annotation-tools.streamlit.app/)

## Text Highlighter
![](docs/highlight_tool.gif)

## Text Labeler
![](docs/label_tool.gif)

# Quick Use

## Text Highlighter

Create an example.py file

```python
from streamlit_annotation_tools import text_highlighter

text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et hendrerit orci. Praesent auctor malesuada lobortis. Suspendisse ac elit bibendum, congue tellus vel, ornare ipsum. Mauris at tellus in turpis aliquet cursus."

annotations = text_highlighter(text)
```

Run:

```
streamlit run example.py
```

Output:

```python
[
  [
    {"start": 0, "end": 5, "label": "Lorem"},
    {"start": 12, "end": 17, "label": "dolor"},
  ],
  [
    {"start": 6, "end": 11, "label": "ipsum"},
    {"start": 18, "end": 21, "label": "sit"},
  ],
]
```

## Text Labeler

Create an example.py file

```python
from streamlit_annotation_tools import text_labeler

text = "Yesterday, at 3 PM, Emily Johnson and Michael Smith met at the Central Park in New York to discuss the merger between TechCorp and Global Solutions. The deal, worth approximately 500 million dollars, is expected to significantly impact the tech industry. Later, at 6 PM, they joined a conference call with the CEO of TechCorp, David Brown, who was in London for a technology summit. During the call, they discussed the market trends in Asia and Europe and planned for the next quarterly meeting, which is scheduled for January 15th, 2024, in Paris."

# Allow users to add new labels (default)
labels = text_labeler(text)

# Or restrict to only using pre-defined labels
predefined_labels = {
    "Personal names": [],
    "Organizations": [],
    "Locations": [],
}
labels = text_labeler(text, labels=predefined_labels, allow_new_labels=False)

# Or show all labels simultaneously by default
labels = text_labeler(text, show_all_labels=True)

# All parameters
labels = text_labeler(
    text,
    labels=predefined_labels,
    in_snake_case=False,
    allow_new_labels=True,
    show_all_labels=False
)
```

Run:

```
streamlit run example.py
```

Output:

```python
{
    "Personal names": [
        {"start": 20, "end": 33, "label": "Emily Johnson"},
        {"start": 38, "end": 51, "label": "Michael Smith"},
        {"start": 327, "end": 338, "label": "David Brown"},
    ],
    "Organizations": [
        {"start": 118, "end": 126, "label": "TechCorp"},
        {"start": 131, "end": 147, "label": "Global Solutions"},
    ],
    "Locations": [
        {"start": 63, "end": 75, "label": "Central Park"},
        {"start": 79, "end": 87, "label": "New York"},
        {"start": 351, "end": 357, "label": "London"},
        {"start": 436, "end": 440, "label": "Asia"},
        {"start": 445, "end": 451, "label": "Europe"},
        {"start": 542, "end": 547, "label": "Paris"},
    ],
    "Time": [
        {"start": 0, "end": 9, "label": "Yesterday"},
        {"start": 14, "end": 18, "label": "3 PM"},
        {"start": 265, "end": 269, "label": "6 PM"},
        {"start": 519, "end": 531, "label": "January 15th"},
        {"start": 533, "end": 537, "label": "2024"},
    ],
    "Money": [{"start": 179, "end": 198, "label": "500 million dollars"}],
}
```

## Features

### Show All Labels Simultaneously

The text labeler now supports showing all labels from all categories at once, instead of just the selected category. This is useful when you want to see the complete annotation overview.

- **Default behavior**: Shows only the selected label category
- **With `show_all_labels=True`**: Shows all labels from all categories simultaneously
- **API Control**: This feature is controlled through the Python API parameter only

When multiple labels overlap, the tool handles them intelligently by:
- Using different colors for each label category
- Adding tooltips to show which category each label belongs to
- Properly handling nested and overlapping spans

# Development

## Install

```
git clone git@github.com:rmarquet21/streamlit-annotation-tools.git
cd streamlit-annotation-tools
pip install -e .
```

## Run

```
streamlit run example.py
```

# License

MIT

# Author

Robin Marquet

# Contributors

- [Robin Marquet](robin.marquet3@gmail.com)

