import * as THREE from 'three'

export default class Bullet extends THREE.Mesh {
    constructor( { hunter, endPosition } ) {
        super(
            new THREE.BoxGeometry(0.2, 0.2, 0.5),
            new THREE.MeshStandardMaterial({color: 0xff0000})
        )

            this.startPosition = hunter.position;
            this.endPosition = endPosition;
            this.position.set(hunter.position.x, hunter.position.y, hunter.position.z+2);

    }
    update(){
        if (this.position.z < this.endPosition){
            this.position.set(this.position.x, this.position.y, this.position.z + 0.01)
        }

    }
}