const el = wp.element.createElement;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

const BLOCKS_TEMPLATE = [
   [ 'core/heading', { placeholder: 'Template Heading, start here!' } ],
    [ 'core/image', {} ],
    [ 'ecablocks/api-block', {} ],
    [ 'core/paragraph', { placeholder: 'Lot\'s of room for descriptive text' } ],
    ['ecablocks/cta']
];

registerBlockType( 'ecablocks/template', {
    title: 'Template Block',
    category: 'widgets',
    edit: ( props ) => {
      return (
         <InnerBlocks
            template={BLOCKS_TEMPLATE}
            templateLock={false}
         >
         </InnerBlocks>
      )
    },
    save: ( props ) => {
        return el( InnerBlocks.Content, {} );
    },
});