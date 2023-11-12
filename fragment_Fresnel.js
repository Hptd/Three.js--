const FragShader = /*glsl*/`
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPositionW;

uniform float powerScale;
uniform float boundary;
uniform float alpha;


void main(){
    float fresnel = dot(vNormal, normalize(cameraPosition - vPositionW));
    fresnel = pow(1. - boundary - max(0., fresnel), powerScale);

    float lambert_ud = dot(vNormal, normalize(vec3(0, 1, 0))) * 0.5 + 0.5;
    lambert_ud = pow(lambert_ud, 2.);

    // outCol 可以自定义效果
    vec4 outCol = vec4(78./255.,118./255.,211./255.,1);
    gl_FragColor = vec4(vec3(fresnel * lambert_ud), alpha);
}`

export default FragShader