import { addNodeMaterial } from './NodeMaterial.js';
import { transformedClearcoatNormalView } from '../accessors/NormalNode.js';
import { roughness, clearcoat, clearcoatRoughness, sheen, sheenRoughness, iridescence, iridescenceIOR, iridescenceThickness, anisotropy, alphaT, anisotropyT, anisotropyB } from '../core/PropertyNode.js';
import { materialAnisotropy, materialClearcoat, materialClearcoatRoughness, materialClearcoatNormal, materialSheen, materialSheenRoughness, materialIridescence, materialIridescenceIOR, materialIridescenceThickness } from '../accessors/MaterialNode.js';
import { float, vec2, vec3, If } from '../shadernode/ShaderNode.js';
import { TBNViewMatrix } from '../accessors/AccessorsUtils.js';
import PhysicalLightingModel from '../functions/PhysicalLightingModel.js';
import MeshStandardNodeMaterial from './MeshStandardNodeMaterial.js';

import { MeshPhysicalMaterial } from 'three';

const defaultValues = new MeshPhysicalMaterial();

class MeshPhysicalNodeMaterial extends MeshStandardNodeMaterial {

	constructor( parameters ) {

		super();

		this.isMeshPhysicalNodeMaterial = true;

		this.clearcoatNode = null;
		this.clearcoatRoughnessNode = null;
		this.clearcoatNormalNode = null;

		this.sheenNode = null;
		this.sheenRoughnessNode = null;

		this.iridescenceNode = null;
		this.iridescenceIORNode = null;
		this.iridescenceThicknessNode = null;

		this.specularIntensityNode = null;
		this.specularColorNode = null;

		this.transmissionNode = null;
		this.thicknessNode = null;
		this.attenuationDistanceNode = null;
		this.attenuationColorNode = null;

		this.anisotropyNode = null;

		this.setDefaultValues( defaultValues );

		this.setValues( parameters );

	}

	get useClearcoat() {

		return this.clearcoat > 0 || this.clearcoatNode !== null;

	}

	get useIridescence() {

		return this.iridescence > 0 || this.iridescenceNode !== null;

	}

	get useSheen() {

		return this.sheen > 0 || this.sheenNode !== null;

	}

	get useAnisotropy() {

		return this.anisotropy > 0 || this.anisotropyNode !== null;

	}

	setupLightingModel( /*builder*/ ) {

		return new PhysicalLightingModel( this.useClearcoat, this.useSheen, this.useIridescence, this.useAnisotropy );

	}

	setupVariants( builder ) {

		super.setupVariants( builder );

		// CLEARCOAT

		if ( this.useClearcoat ) {

			const clearcoatNode = this.clearcoatNode ? float( this.clearcoatNode ) : materialClearcoat;
			const clearcoatRoughnessNode = this.clearcoatRoughnessNode ? float( this.clearcoatRoughnessNode ) : materialClearcoatRoughness;

			clearcoat.assign( clearcoatNode );
			clearcoatRoughness.assign( clearcoatRoughnessNode );

		}

		// SHEEN

		if ( this.useSheen ) {

			const sheenNode = this.sheenNode ? vec3( this.sheenNode ) : materialSheen;
			const sheenRoughnessNode = this.sheenRoughnessNode ? float( this.sheenRoughnessNode ) : materialSheenRoughness;

			sheen.assign( sheenNode );
			sheenRoughness.assign( sheenRoughnessNode );

		}

		// IRIDESCENCE

		if ( this.useIridescence ) {

			const iridescenceNode = this.iridescenceNode ? float( this.iridescenceNode ) : materialIridescence;
			const iridescenceIORNode = this.iridescenceIORNode ? float( this.iridescenceIORNode ) : materialIridescenceIOR;
			const iridescenceThicknessNode = this.iridescenceThicknessNode ? float( this.iridescenceThicknessNode ) : materialIridescenceThickness;

			iridescence.assign( iridescenceNode );
			iridescenceIOR.assign( iridescenceIORNode );
			iridescenceThickness.assign( iridescenceThicknessNode );

		}

		// ANISOTROPY

		if ( this.useAnisotropy ) {

			const anisotropyV = ( this.anisotropyNode ? vec2( this.anisotropyNode ) : materialAnisotropy ).toVar();

			anisotropy.assign( anisotropyV.length() );

			If( anisotropy.equal( 0.0 ), () => {

				anisotropyV.assign( vec2( 1.0, 0.0 ) );

			} ).else( () => {

				anisotropyV.divAssign( anisotropy );
				anisotropy.assign( anisotropy.saturate() );

			} );

			// Roughness along the anisotropy bitangent is the material roughness, while the tangent roughness increases with anisotropy.
			alphaT.assign( anisotropy.pow2().mix( roughness.pow2(), 1.0 ) );

			anisotropyT.assign( TBNViewMatrix[ 0 ].mul( anisotropyV.x ).add( TBNViewMatrix[ 1 ].mul( anisotropyV.y ) ) );
			anisotropyB.assign( TBNViewMatrix[ 1 ].mul( anisotropyV.x ).sub( TBNViewMatrix[ 0 ].mul( anisotropyV.y ) ) );

		}

	}

	setupNormal( builder ) {

		super.setupNormal( builder );

		// CLEARCOAT NORMAL

		const clearcoatNormalNode = this.clearcoatNormalNode ? vec3( this.clearcoatNormalNode ) : materialClearcoatNormal;

		transformedClearcoatNormalView.assign( clearcoatNormalNode );

	}

	copy( source ) {

		this.clearcoatNode = source.clearcoatNode;
		this.clearcoatRoughnessNode = source.clearcoatRoughnessNode;
		this.clearcoatNormalNode = source.clearcoatNormalNode;

		this.sheenNode = source.sheenNode;
		this.sheenRoughnessNode = source.sheenRoughnessNode;

		this.iridescenceNode = source.iridescenceNode;
		this.iridescenceIORNode = source.iridescenceIORNode;
		this.iridescenceThicknessNode = source.iridescenceThicknessNode;

		this.specularIntensityNode = source.specularIntensityNode;
		this.specularColorNode = source.specularColorNode;

		this.transmissionNode = source.transmissionNode;
		this.thicknessNode = source.thicknessNode;
		this.attenuationDistanceNode = source.attenuationDistanceNode;
		this.attenuationColorNode = source.attenuationColorNode;

		this.anisotropyNode = source.anisotropyNode;

		return super.copy( source );

	}

}

export default MeshPhysicalNodeMaterial;

addNodeMaterial( 'MeshPhysicalNodeMaterial', MeshPhysicalNodeMaterial );
