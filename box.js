import * as THREE from 'three';
import Bullet from './bullet.js';

export default class Box extends THREE.Mesh{
	constructor(
		{ name, width, height, depth, color, velocity = {x: 0, y: 0, z:0}, pVelocity = 0, position = {x: 0, y:0, z:0}, material, enemyType, rShadow = false, cShadow = false}){
		super(
			new THREE.BoxGeometry(width, height, depth),
			material ? material : new THREE.MeshStandardMaterial({color: color})
			// new THREE.ShaderMaterial({
			// 	vertexShader: vertexShader,
			// 	fragmentShader: fragmentShader
			// })
		)
		
		this.width = width;
		this.height = height;
		this.depth = depth;
		

		// We Have To Set Position Before Top, Bottom... Because They Would Use The Start Position
		this.position0 = position;
		this.position.set(position.x, position.y, position.z);

		this.bottom = this.position.y - this.height/2;
		this.top = this.position.y + this.height/2;
		this.left = this.position.x - this.width/2;
		this.right = this.position.x + this.width/2;
		this.front = this.position.z - this.depth/2;
		this.back = this.position.z + this.depth/2;
		this.velocity = velocity;
		this.pVelocity = pVelocity;
		this.gravity = -0.005
		this.jumps = 0;
		this.name = name;
		this.stop = false;
		this.dead = false;
		this.castShadow = cShadow;
		this.receiveShadow = rShadow;
		this.bullets = 0;
		this.enemyType = enemyType;

	};
	update(ground){
		this.bottom = this.position.y - this.height/2;
		this.top = this.position.y + this.height/2;
		this.left = this.position.x - this.width/2;
		this.right = this.position.x + this.width/2;
		this.front = this.position.z - this.depth/2;
		this.back = this.position.z + this.depth/2;

		this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
		this.position.z += this.velocity.z;


		this.pVelocity += -this.pVelocity * .3;
		this.translateZ( this.pVelocity );
		
		this.applyGravity(ground);

		if (this.position.y < -10) {
			this.name == "enemy" ? this.respawn({x:false, y:false, z:true}) : this.respawn()
		}
		if (this.enemyType == "distance" && this.bullets == 0){
			let bullet = new Bullet({hunter: this, endPosition: 4});
			this.bullets++;
			bullet.update();
			bullet.update();

		}
	}
	applyGravity(ground){
		// Hit The Ground
		if ( this.bottom + this.velocity.y <= ground.top 
			&& this.left < ground.right && this.right > ground.left 
			&& this.front < ground.back && this.back > ground.front)
			{
			if (this.stop) return 0;
			// Reverse The Direction
			this.velocity.y = -this.velocity.y
			// Minimize The Jump Height
			this.velocity.y *= 0.85;
			// Increase Jumps Counter
			this.jumps++;
			// End
			if (this.jumps > 100){
				this.stop = true;
				this.velocity.y = 0;
				this.position.y = ground.top + this.height/2;
				this.jumps = 0;
			}
		}
		else {
			this.velocity.y += this.gravity;
			this.stop = false;
		}
	}
	respawn(keepVelocity={x: false, y:false, z:false}){
		if (this.name == 'cube') this.dead = true;
		this.position.set(this.position0.x, this.position0.y, this.position0.z);
		this.rotation.y = 0;
		this.velocity = {
			x: keepVelocity.x ? this.velocity.x : 0 ,
			y: keepVelocity.y ? this.velocity.y : 0 ,
			z: keepVelocity.z ? this.velocity.z : 0 
		}
		this.rotation.y = 0;
	}
}
