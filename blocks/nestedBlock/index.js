import './style.scss';
import './editor.scss';


/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { ColorPalette } = wp.components;
const { InspectorControls } = wp.editor;
const { MediaUpload } = wp.editor;
const { InnerBlocks } = wp.editor;
import icon from './icon';


export default registerBlockType("ecablocks/nested-block", {
   title: __("Nesting Block", "ecablocks"),
   description: __(
      "A block in which to nest others",
      "ecablocks"
   ),
   category: "common",
   icon: {
      src: icon
   },
   supports: {
      html: false
    },
    attributes: {

    },

    edit: props => {
      const { className } = props;
         return (
            <div className={ className }>
               <InnerBlocks
               allowedBlocks={['ecablocks/frame-device']}
                />
            </div>
         );
    },
    save: props => {
      return (
         <div>
           <InnerBlocks.Content />
         </div>
       );
    }
});