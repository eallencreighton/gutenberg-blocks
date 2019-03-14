import './style.scss';
import './editor.scss';


/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType,
      source
   } = wp.blocks;
const { ColorPalette } = wp.components;
const { MediaUpload, RichText, InspectorControls  } = wp.editor


/**
 * Register Block using default icon options.
 * 
 * @param   {String}    name        Block name, namespaced
 * @param   {Object}    settings    Block settings
 * @return  {?WPBlock}              Return the block or 'undefined'
*/

export default registerBlockType("ecablocks/cta", {
   title: __("CTA (Example)", "ecablocks"),
   description: __(
      "A complex custom block",
      "ecablocks"
   ),
   category: "common",
   icon: "heart",
   supports: {
      html: false
    },
    attributes: {
       imageAlt: {
         attribute: 'alt',
         selector: '.cta-card__image',

       },
       imageUrl: {
         attribute: 'src',
         selector: '.cta-card__image',
         default: 'https://picsum.photos/200/300'
       },
       color: {
         type: 'string',
         default: '#46aaf8'
       },
       styles: {
          type: 'object',
          default: {
             border: `15px solid #EA6F4E`
          }
       },
       cta_header: {
         type: 'array', 
          selector: 'h2',
          source: 'children'
       },
       cta_paragraph: {
         type: 'array', 
          selector: 'p',
          source: 'children'
       },
      // Text of the link-button
      link_text: { 
         selector: 'button', // From tag a
         source: 'text',  // binds children of a: the link text
      },
      // URL of the link-button
      link_url: { 
         selector: 'a', // From tag a
         source: 'attribute', // binds an attribute of the tag
         attribute: 'href', // binds href of a: the link url
      },
      // To storage background colour of the button
      button_color: { 
         type: 'string', 
         default: 'red', // Default value for newly added block
      },
      // To storage text colour of the button
      text_color: { 
         type: 'string',
         default: 'white', // Default value for newly added block
      },            
      // To storage the complete style of the button that will be 'merged' with the selected colours
      button_style: { 
         selector: 'a', // From tag a
         source: 'attribute', // binds an attribute of the tag
         attribute: 'style', // binds style of a: the dynamic colours
      }
    },

    edit: props => {
      const { 
         attributes, 
         className, 
         setAttributes,
     } = props;

     let styles = props.attributes.styles;

     const colors = [ 
      { name: 'blue', color: '#2A7BCC'},
      { name: 'red', color: '#EA6F4E' }, 
      { name: 'orange', color: '#F3B100' }, 
      { name: 'green', color: '#97CDC5'},
      { name: 'pink', color: '#FCE4D0'}
      ];

      const cta_header = props.attributes.cta_header;
      const cta_paragraph = props.attributes.cta_paragraph;
      const link_text = props.attributes.link_text; // To bind attribute link_text
      const link_url = props.attributes.link_url; // To bind attribute link_url
      const text_color = props.attributes.text_color; // To bind text colour
      const button_color = props.attributes.button_color; // To bind button background colour

      // Style object for the button
      // I created a style in JSX sintax to keep it here for
      // the dynamic changes


      // save the colour selected from the ColorPalette to attributes
     const onChangeStyles = (value, key) => {
         const newObject = Object.assign({},attributes.styles);
         //var styles = attributes.styles;
         //retreive the styles object so that we can insert the new value into the correct structure
         var newStyles = newObject;
         console.log(newStyles);
         //save te colour as a border value
         var newValue = `15px solid ${value}`;
         //insert the new value into the attributes.styles object
         newStyles[key] = newValue;
         //set it to the block state
         setAttributes( {
               styles: { ...newStyles }
         });

      }
      const onChangeContentParagraph = ( content )  => {
         setAttributes({cta_paragraph: content})
      }
      const onChangeContentHeader = ( content )  => {
         setAttributes({cta_header: content})
      } 

      const onChangeContentURL = ( content ) => {
         setAttributes({link_url: content})
      } 

      const onChangeContentName = ( content )  => {
         setAttributes({link_text: content})
      } 

      const onChangeButtonColor = ( content )  => {
         setAttributes({button_color: content})
      }   

      const onChangeTextColor = ( content )  => {
         setAttributes({text_color: content})
      }


     const getImageButton = (openEvent) => {
        //click event to replace default image
      if(attributes.imageUrl) {
        return (
          <img 
            src={ attributes.imageUrl }
            onClick={ openEvent }
            className="cta-card__image"
            style={{ border: styles.border }}
          />
        );
      }
    };
    
      return (
        <div className={className}

         >
         
         <div class="flex-parent">
            <div class='img-container'>
               <MediaUpload
                  onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url}); } }
                  type="image"
                  value={ attributes.imageID }
                  render={ ({ open }) => getImageButton(open) }
                  className="cta-card__image"
               />
            </div>
            <div class='cta-square-text'>
               <div class='cta-square-inner-text'>
                  <RichText
                     tagName="h2"
                     onChange={onChangeContentHeader} // onChange event callback
                     value={cta_header} // Input Binding
                     placeholder="Header copy here"
                  />
                  <RichText
                     onChange={onChangeContentParagraph} // onChange event callback
                     value={cta_paragraph} // Input Binding
                     placeholder="descriptive paragraph"
                  />
                  <button type="button" style={{background: button_color}}
                  >
                     <RichText
                           onChange={onChangeContentName} // onChange event callback
                           value={link_text} // Input Binding
                           placeholder="lovely button"
                     />
                  </button>
               </div>
            </div>
         </div>
        <InspectorControls
             //add the inspector controls, to display alongside the right of the page, here
        >
           
        <label>Frame colours</label>
        <div>
        <ColorPalette 
           colors={ colors }
           onChange= {function(color){
              onChangeStyles( color, 'border' )
           }
           }
        /> 
        </div>
        <label>Button colours</label>
        <div>
        <ColorPalette // Element Tag for Gutenberg standard colour selector
              colors={ colors }
              onChange={onChangeButtonColor} // onChange event callback
        />
        </div>
        </InspectorControls>

        </div>

       
      );
    },
    save: props => {
      const { attributes, className } = props;
      const cardImage = (src, alt) => {
         if(!src) return null;
     
         if(alt) {
           return (
             <img 
               className="cta-card__image" 
               src={ src }
               alt={ alt }
               style={{ border: attributes.styles.border }}
             /> 
           );
         }
         
         // No alt set, so let's hide it from screen readers
         return (
           <img 
             className="cta-card__image" 
             src={ src }
             alt=""
             aria-hidden="true"
             style={{ border: attributes.styles.border }}
           /> 
         );
       };
       return (
         <div className={className}

         >  
            
            <div className="flex-parent">
            <div class='img-container'>
               { cardImage(attributes.imageUrl, attributes.imageAlt) }
               </div>
               <div class='cta-square-text'>
                  <div class='cta-square-inner-text'>
                     <h2>{attributes.cta_header}</h2>
                     <p>{attributes.cta_paragraph}</p>
                     <button  type="button" style={{background: attributes.button_color}}>
                        {attributes.link_text}
                     </button>
                  </div>
               </div>
            </div>
         </div>
       );
    }
});