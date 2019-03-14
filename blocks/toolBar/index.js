import './style.scss';
import './editor.scss';
import icon from './icon';
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
    registerBlockType,
} = wp.blocks;
const {
    RichText,
    AlignmentToolbar,
    BlockControls,
    BlockAlignmentToolbar,
} = wp.editor;
const {
    Dashicon,
    Toolbar,
    Button,
    Tooltip,
} = wp.components;

export default registerBlockType('ecablocks/toolbar',
   {
      title: __('Toolbar', 'ecablocks'),
      description: __('Messign around with the hoverable toolbar', 'ecablocks'),
      category: 'common',
      icon: {
         src: icon,
         background: 'green'
      },
      keywords: [
         __( 'Button', 'ecablocks' ),
         __( 'Settings', 'ecablocks' ),
         __( 'Controls', 'ecablocks' ),
     ],
     attributes: {
      alignment: {
          type: 'string',
      },
      blockAlignment: {
          type: 'string',
      },
      highContrast: {
          type: 'boolean',
          default: false,
      },
      message: {
          type: 'array',
          source: 'children',
          selector: '.message-body',
      },
  },
   getEditWrapperProps( attributes ) {
      const { blockAlignment } = attributes;
      if ( 'left' === blockAlignment || 'right' === blockAlignment || 'full' === blockAlignment ) {
      return { 'data-align': blockAlignment };
      }
   },


  edit: props => {
      const { attributes: {alignment, blockAlignment, message, highContrast},
         className, setAttributes } = props;
         const classes = classnames(
            className,
            { 'high-contrast': highContrast}
         )
      return (
          <div className={ classes }>
             <BlockControls key="custom-controls" >
               <BlockAlignmentToolbar 
                   value={ blockAlignment }
                   onChange={ blockAlignment => setAttributes( { alignment} )}
               />
               <AlignmentToolbar
                     value={ alignment }
                     onChange={ alignment => props.setAttributes( { alignment } ) }
               />
               <Toolbar>
                  <Tooltip text={__('High Contrast', 'ecablocks' )}>
                  <Button
                     className={ classnames(
                     'components-icon-button',
                     'components-toolbar__control',
                     { 'is-active': highContrast },
                     ) }
                     onClick={ () => setAttributes( { highContrast: ! highContrast } ) }
                     >
                     { icon }
                  </Button>
                  </Tooltip>
               </Toolbar>
             </BlockControls>
               <RichText
                  tagName="div"
                  multiline="p"
                  placeholder={ __( 'Enter your message here..', 'ecablocks' ) }
                  value={ message }
                  className={ classnames(
                        'message-body',
                        { 'high-contrast': highContrast }
                  ) }
                  style={ { textAlign: alignment } }
                  onChange={ ( message ) => props.setAttributes( { message } ) }
               />
          </div>
      );
  },
   save: props => {
   const { highContrast, alignment, message } = props.attributes;
   const className = classnames(
         'message-body',
         { 'high-contrast': highContrast },
   );
   return (
         <div
            className={ className }
            style={ { textAlign: alignment } }
         >
            { message }
         </div>
   )
   },

},

)