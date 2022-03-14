import Command from '@ckeditor/ckeditor5-core/src/command';

export default class VariableCommand extends Command {
  execute({ value }) {
    const editor = this.editor;
    const selection = editor.model.document.selection;

    editor.model.change( writer => {
      const variable = writer.createElement('variable', {
        ...Object.fromEntries( selection.getAttributes()),
        name: value
      });

      editor.model.insertContent(variable);

      writer.setSelection(variable, 'on');
    });
  }
  
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;

    const isAllowed = model.schema.checkChild(selection.focus.parent, 'variable');

    this.isEnabled = isAllowed;
  }
};
