<?php
/**
 * Plugin Name: ECA blocks
 * Plugin URI: https://www.ecentricarts.com/
 * Description: A collection of ECA custom blocks.
 * Text Domain: ecablocks
 * Domain Path: /languages
 * Author: Esme Allen-Creighton
 * Author URI: http://esmecodes.com
 * Version: 2.1.0
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package ecablocks
 */

//  Exit if accessed directly.
defined('ABSPATH') || exit;

// Only load if Gutenberg is available.
if ( ! function_exists( 'register_block_type' ) ) {
	return;
}

/**
 * Enqueue block editor only JavaScript and CSS
 */
function ecablocks_editor_scripts()
{

    // Make paths variables so we don't write em twice ;)
    $blockPath = '/assets/js/editor.blocks.js';
    $editorStylePath = '/assets/css/blocks.editor.css';

    // Enqueue the bundled block JS file
    wp_enqueue_script(
        'ecablocks-blocks-js',
        plugins_url( $blockPath, __FILE__ ),
        [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
        filemtime( plugin_dir_path(__FILE__) . $blockPath )
    );

    // Enqueue optional editor only styles
    wp_enqueue_style(
        'ecablocks-blocks-editor-css',
        plugins_url( $editorStylePath, __FILE__),
        [],
        filemtime( plugin_dir_path( __FILE__ ) . $editorStylePath )
    );

}


// Hook scripts function into block editor hook
add_action('enqueue_block_assets', 'ecablocks_scripts');
// Hook scripts function into block editor hook
add_action( 'enqueue_block_editor_assets', 'ecablocks_editor_scripts' );


/**
 * Enqueue front end and editor JavaScript and CSS
 */
function ecablocks_scripts()
{
    $blockPath = '/assets/js/frontend.blocks.js';
    // Make paths variables so we don't write em twice ;)
    $stylePath = '/assets/css/blocks.style.css';

    // Enqueue the bundled block JS file
    wp_enqueue_script(
        'ecablocks-blocks-frontend-js',
        plugins_url( $blockPath, __FILE__ ),
        [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-api', 'wp-editor' ],
        filemtime( plugin_dir_path(__FILE__) . $blockPath )
    );

    // Enqueue frontend and editor block styles
    wp_enqueue_style(
        'ecablocks-blocks-css',
        plugins_url($stylePath, __FILE__),
        null,
        filemtime(plugin_dir_path(__FILE__) . $stylePath )
    );

}




function ecablocks_api_block_posts( $attributes ) {

	$recent_posts = wp_get_recent_posts(
		array(
			'numberposts' => 3,
			'post_stats'  => 'publish',
		)
	);

	$dynamic_block_title = ( $attributes['content'] ) ? sprintf( '<h2>%1$s</h2>', $attributes['content'] ) : '';

	$list_item_markup = '';

	foreach ( $recent_posts as $post ) {
		$post_id = $post['ID'];

		$title = get_the_title( $post_id );

		$list_item_markup .= sprintf(
			'<li><a href="%1$s">%2$s</a></li>',
			esc_url( get_permalink( $post_id ) ),
			esc_html( $title )
		);
	}

	$class = 'ecablocks-api-block';
	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}

	$block_content = sprintf(
		'<div class="%1$s">%2$s<ul>%3$s</ul></div>',
		esc_attr( $class ),
		$dynamic_block_title,
		$list_item_markup
	);

	return $block_content;
}

function register_dynamic_blocks() {


	register_block_type(
		'ecablocks/api-block',
		array(
			'attributes' => array(
				'content' => array(
					'type' => 'string',
				),
				'className' => array(
					'type' => 'string',
				),
			),
			'render_callback' => 'ecablocks_api_block_posts',
		)
	);
}

add_action( 'init', 'register_dynamic_blocks' );

//custom template