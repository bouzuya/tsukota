FROM gcr.io/google.com/cloudsdktool/google-cloud-cli:433.0.1-emulators
# RUN apk add --upgrade npm
# RUN apt-get update && apt-get -y install nodejs npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
ENV NODE_VERSION=18.16.0
ENV NVM_DIR=/root/.nvm
RUN . "${NVM_DIR}/nvm.sh" && nvm install "${NODE_VERSION}"
RUN . "${NVM_DIR}/nvm.sh" && nvm use "v${NODE_VERSION}"
RUN . "${NVM_DIR}/nvm.sh" && nvm alias default "v${NODE_VERSION}"
ENV PATH="${NVM_DIR}/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN npm install --global npm
RUN npm install --global firebase-tools
WORKDIR /home/cloudsdk
ENTRYPOINT [ "firebase" ]
