import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

const Slider = () => (
  <div>
    <div className="shap_big_2 d-none d-lg-block">
      <img src="img/ilstrator/body_shap_2.png" alt="" />
    </div>

    <div className="slider_area">
      <div className="shap_img_1 d-none d-lg-block">
        <img src="img/ilstrator/body_shap_1.png" alt="" />
      </div>
      <div className="poly_img">
        <img src="img/ilstrator/poly.png" alt="" />
      </div>
      <div className="single_slider d-flex align-items-center slider_bg_1">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-10 offset-xl-1">
              <div className="slider_text text-center">
                <div className="text">
                  <h3>
                    Gérez vos projets efficacement et optimisez votre workflow
                  </h3>
                  <p>
                    Centralisez tout votre contenu, même dans une équipe distribuée.
                  </p>

                  

                  {/* Pour les utilisateurs non authentifiés :
                      - Ouvre la modale de connexion Clerk
                      - Redirige vers /kanban après connexion */}
                  <SignedOut>
                    <SignInButton mode="modal" fallbackRedirectUrl="/app">
                      <button className="boxed-btn3">
                        Inscrivez-vous, c'est gratuit !
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
                <div className="ilstrator_thumb">
                  <video
                    width="100%"
                    height="auto"
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="img/logo/video.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Slider;
