function setPolygon(){
    let divPolygon = document.querySelectorAll(".polygon");
    //console.log(divPolygon);
    divPolygon.forEach(element => {
        element.innerHTML = "<div class=\"d-inline-block align-center svg-attributes-demo\"><svg width=\"128\" height=\"128\" viewBox=\"0 0 128 128\"><filter id=\"displacementFilter\"><feTurbulence type=\"turbulence\" baseFrequency=\".05\" numOctaves=\"2\" result=\"turbulence\"/><feDisplacementMap in2=\"turbulence\" in=\"SourceGraphic\" scale=\"15\" xChannelSelector=\"R\" yChannelSelector=\"G\"/></filter><polygon points=\"64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100\" style=\"filter: url(#displacementFilter)\" fill=\"currentColor\"/></svg></div>";
    });
}

function playPolygon(){
    anime({
      targets: ['.svg-attributes-demo polygon', 'feTurbulence', 'feDisplacementMap'],
      points: '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96',
      baseFrequency: 0,
      scale: 1,
      loop: true,
      autoplay: true,
      direction: 'alternate',
      easing: 'easeInOutExpo'
    });
}

// named export
export {setPolygon, playPolygon};