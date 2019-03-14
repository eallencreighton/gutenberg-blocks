import './style.scss';
import './editor.scss';


/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { ColorPalette } = wp.components;
const { InspectorControls } = wp.editor;
const { MediaUpload } = wp.editor


/**
 * Register Block using default icon options.
 * 
 * @param   {String}    name        Block name, namespaced
 * @param   {Object}    settings    Block settings
 * @return  {?WPBlock}              Return the block or 'undefined'
*/

export default registerBlockType("ecablocks/frame-device", {
   title: __("Frame Device", "ecablocks"),
   description: __(
      "A device to add brand colours to a frame",
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
         selector: '.card__image',

       },
       imageUrl: {
         attribute: 'src',
         selector: '.card__image',
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


     const getImageButton = (openEvent) => {
        //click event to replace default image
      if(attributes.imageUrl) {
        return (
          <img 
            src={ attributes.imageUrl }
            onClick={ openEvent }
            className="card__image"
            style={{ border: styles.border }}
          />
        );
      }
    };
    

      return (
        <div className={className}

         >
         
          <MediaUpload
            onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url}); } }
            type="image"
            value={ attributes.imageID }
            render={ ({ open }) => getImageButton(open) }
            className="card__image"
         />
         <InspectorControls>
         <ColorPalette 
               colors={ colors }
               
               onChange= {function(color){

                  onChangeStyles( color, 'border' )
               }
               
            }
            /> 
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
               className="card__image" 
               src={ src }
               alt={ alt }
               style={{ border: attributes.styles.border }}
             /> 
           );
         }
         
         // No alt set, so let's hide it from screen readers
         return (
           <img 
             className="card__image" 
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
            <div className="card">

            { cardImage(attributes.imageUrl, attributes.imageAlt) }
            

            </div>
         </div>
       );
    }
});