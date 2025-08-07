import Header from "@editorjs/header";
import Alert from 'editorjs-alert';
import EditorjsList from "@editorjs/list";
import editorjsCodeCup from "@calumk/editorjs-codecup";
import Marker from "@editorjs/marker";
import Table from "@editorjs/table";



class Header1 extends Header {
  static get toolbox() {
    return {
      title: "Heading 1",
      icon: "<b>H1</b>",
    };
  }
}

class Header2 extends Header {
  static get toolbox() {
    return {
      title: "Heading 2",
      icon: "<b>H2</b>",
    };
  }
}

class Header3 extends Header {
  static get toolbox() {
    return {
      title: "Heading 3",
      icon: "<b>H3</b>",
    };
  }
}

class Header4 extends Header {
  static get toolbox() {
    return {
      title: "Heading 4",
      icon: "<b>H4</b>",
    };
  }
}

export const EDITOR_JS_TOOLS = {
    header1: {
        class: Header1,
        inlineToolbar: true,
        config: {
            placeholder: "Heading 1",
            levels: [1],
            defaultLevel: 1,
        }
    },
    header2: {
        class: Header2,
        inlineToolbar: true,
        config: {
            placeholder: "Heading 2",
            levels: [2],
            defaultLevel: 2,
        }
    },
    header3: {
        class: Header3,
        inlineToolbar: true,
        config: {
            placeholder: "Heading 3",
            levels: [3],
            defaultLevel: 3,
        }
    },
    header4: {
        class: Header4,
        inlineToolbar: true,
        config: {
            placeholder: "Heading 4",
            levels: [4],
            defaultLevel: 4,
        }
    },
    alert: {
        class: Alert,
        inlineToolbar: true,
        config: {
            alertTypes: ['primary', 'secondary', 'success', 'danger', 'warning'],
            defaultType: 'primary',
            messagePlaceholder: "Alert message",
        }
    },
    List: {
        class: EditorjsList,
        inlineToolbar: true,
        config: {
            defaultStyle: 'unordered',
        }
    },
    code: editorjsCodeCup,
    Marker: {
        class: Marker,
        inlineToolbar: true,
    },
    table: {
        class: Table,
        inlineToolbar: true,
    }

}