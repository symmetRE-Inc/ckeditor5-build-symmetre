import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import VariableCommand from './variablecommand';
import './theme/variable.css';  

export default class VariableEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {    
    this._defineSchema();
    this._defineConverters();
    
    this.editor.commands.add('variable', new VariableCommand(this.editor));
    
    this.editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('variable'))
    );
    
    this.editor.config.define('variableConfig', { types: [] });
  }
  
  _defineSchema() {
    const schema = this.editor.model.schema;
    
    schema.register('variable', {
      allowWhere: '$text',
      isInline: true,
      isObject: true,
      allowAttributesOf: '$text',
      allowAttributes: ['name']
    });
  }
  
  _defineConverters() {
    const conversion = this.editor.conversion;
    
    conversion.for('upcast').elementToElement( {
      view: {
        name: 'span',
        classes: ['variable']
      },
      model: ( viewElement, { writer: modelWriter } ) => {
        const name = viewElement.getChild(0).data;
        console.log(name);

        return modelWriter.createElement('variable', { name });
      }
    });
    
    conversion.for('editingDowncast').elementToElement( {
      model: 'variable',
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createVariableView(modelItem, viewWriter);

        return toWidget(widgetElement, viewWriter);
      }
    });
    
    conversion.for('dataDowncast').elementToElement({
      model: 'variable',
      view: (modelItem, { writer: viewWriter }) => createVariableView(modelItem, viewWriter)
    });
    
    function createVariableView(modelItem, viewWriter) {
      const name = modelItem.getAttribute('name');

      const variableView = viewWriter.createContainerElement('span', {
        class: 'variable'
      }, {
        isAllowedInsideAttributeElement: true
      });

      const innerText = viewWriter.createText(name);
      viewWriter.insert(viewWriter.createPositionAt(variableView, 0), innerText);

      return variableView;
    };
  }
}
