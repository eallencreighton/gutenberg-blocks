import './style.scss';
import './editor.scss';
import icon from './icon';


/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { AlignmentToolbar, BlockControls, BlockAlignmentToolbar, } = wp.editor;
const { InnerBlocks } = wp.editor;


export default registerBlockType("ecablocks/container", {
   title: __("Container", "ecablocks"),
   description: __(
      "A container for content sections that can be full or partial width",
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
      alignment: {
         type: 'string',
      },
      blockAlignment: {
         type: 'string',
      },
    },
    getEditWrapperProps( attributes ) {
      const { blockAlignment } = attributes;
      if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment ) {
      return { 'data-align': blockAlignment };
      }
   },
    edit: props => {
      const { attributes } = props;
      const blockAlignment = attributes.blockAlignment;
      const alignment = attributes.alignment;
      const { className } = props;
         return (
            <div className={ className }
            data-align={ blockAlignment }
            style={{textAlign: alignment}}
            >
               <div>
               {
               !! focus && (
                  <BlockControls key="custom-controls" >
                  <BlockAlignmentToolbar 
                     value={ blockAlignment }
                     onChange={ blockAlignment => props.setAttributes( { blockAlignment } ) }
                  />
                  <AlignmentToolbar
                     value={ alignment }
                     onChange={ alignment => props.setAttributes( { alignment } ) }
                  />
                  </BlockControls>
               )
            }
               </div>
               <InnerBlocks
               //allowedBlocks={['ecablocks/frame-device']}
                />
            </div>
         );
    },
    save: props => {
      const { className } = props;
      const { blockAlignment } = props.attributes;
      const { alignment } = props.attributes;
      return (
         <div
            className={ className }
            data-align={ blockAlignment }
            style={{textAlign: alignment}}
         >
           <InnerBlocks.Content />
         </div>
       );
    }
});