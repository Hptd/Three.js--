const VertShader = /*glsl*/`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPositionW;
varying vec3 vCameraPositionV;


void main(){
    vUv = uv;

    vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
    
    /* 法线的空间转换:
        vNormal = normalize(normal); // 模型空间(与世界空间着色相同)
        vNormal = normalize(normalMatrix * normal); // 转换到视觉空间
    */
   /* 空间转换矩阵的说明
        modelMatrix  -->  模型空间转世界空间矩阵
        modelViewMatrix  -->  模型空间直接转到视觉空间
        viewMatrix  -->  世界空间转视觉空间矩阵
   */
    vNormal = normalize(normal); // 模型空间(世界空间相同)

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
export default VertShader