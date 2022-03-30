import React from 'react'
import ContributionButton from './ContributionButton'
import DocumentationButton from './DocumentationButton'
import { Link } from 'react-router-dom'
import Illustration from './images/ecolab-climat-dessin.svg'
import Marianne from './images/Marianne.png'
import emoji from 'react-easy-emoji'

export default () => {
	return (
		<div
			css={`
				border-radius: 1rem;
				padding: 0.2rem;
				h1 {
					margin-top: 0.6rem;
					font-size: 100%;
					line-height: 1.2em;
				}
				> div > a {
				}
				text-align: center;
				> img {
					width: 50%;
					border-radius: 0.8rem;
				}
				@media (max-width: 800px) {
					> img {
						width: 80%;
					}
				}
			`}
		>
			<h3>Connaissez-vous l'empreinte carbone du numérique de votre organisation ?</h3>
			<img src={Illustration} />
			<h1>ATTENTION : Pour faire le test, vous devez connaître quelques données :</h1>
			<ul>
     <li>Nombre de collaborateurs de votre organisation </li>
      <li>Nombre de téléphones portables</li>
      <li>Nombre d'ordinateurs de bureau</li>
			<li>Nombre d'écrans </li>
      <li>Nombre d'imprimantes</li>
			<li>Nombre d'ordinateurs portables </li>
      <li>Nombre de matériels annexes informatique (souris, clavier, stations d'accueil...)</li>
			<li>Nombre de serveurs physiques déployés</li>
      </ul>

			<br></br>
			<h1>L'ensemble des valeurs par défaut fournies dans ce formulaire sont des valeurs moyennes représentatives de votre type d'organisation.</h1>
			<br></br>
			<div css="margin: 1rem 0 .6rem;">
				<Link to="/simulateur/bilan" className="ui__ plain button">
					Faire le test
				</Link>
			</div>


			<div css="margin: .6rem 0 2rem;">
				<Link to="/actions" className="ui__ button">
					Passer à l'action
				</Link>
			</div>
			<footer>
				<div
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 1rem;
						img {
							margin: 0 0.6rem;
						}
					`}
				>
					<img css="height: 6rem; margin-right: .6rem" src={Marianne} />


							<a href="https://institutnr.org/">
							<img
							css="height: 4rem; margin-right: .9rem"
							src="https://institutnr.org/wp-content/uploads/2020/08/INR-logo-s.jpg"
						/>
					</a>
				</div>
				<div
					css={`
						display: flex;
						justify-content: center;
						flex-wrap: wrap;
						> * {
							margin: 0 0.6rem;
						}
					`}
				>
					<Link to="/à-propos">{emoji('❔ ')}À propos</Link>
					<DocumentationButton />
					<Link to="/vie-privée">
						{emoji('🙈 ')}
						Vie privée
					</Link>
				</div>
			</footer>
		</div>
	)
}
