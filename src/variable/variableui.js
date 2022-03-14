import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

export default class VariableUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;
    const variableNames = editor.config.get('variableConfig.types');   
    
    editor.ui.componentFactory.add('variable', locale => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(dropdownView, getDropdownItemsDefinitions(variableNames));

      dropdownView.buttonView.set({
        label: t('Variables'),
        tooltip: true,
        withText: true
      });

      const command = editor.commands.get('variable');
      dropdownView.bind( 'isEnabled' ).to(command);

      this.listenTo(dropdownView, 'execute', evt => {
        editor.execute('variable', { value: evt.source.commandParam });
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}

function getDropdownItemsDefinitions(variableNames) {
  const itemDefinitions = new Collection();

  for (const variable of variableNames) {
    const definition = {
      type: 'button',
      model: new Model({
        commandParam: variable,
        label: variable,
        withText: true
      })
    };

    itemDefinitions.add(definition);
  }

  return itemDefinitions;
}
