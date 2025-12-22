FROM ruby:2.6.6
# Install NodeJS and Yarn
RUN apt-get --allow-releaseinfo-change update
RUN apt-get -y install curl
RUN apt-get install -my gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get --allow-releaseinfo-change update && apt-get -qqyy install nodejs yarn && rm -rf /var/lib/apt/lists/*
# Install Ruby Gems and node modules
COPY Gemfile* /tmp/
COPY package.json /tmp/
COPY yarn.lock /tmp/
COPY mimemagic-01f92d86d15d /tmp/mimemagic-01f92d86d15d
WORKDIR /tmp
RUN gem install bundler -v 2.2.2
RUN bundle install --jobs 5 --retry 5 --without development test
RUN yarn install
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir /app
WORKDIR /app
COPY . /app
ENV RAILS_ENV production
ENV RACK_ENV production
# Execute the Procfile
CMD ["bin/run-dev.sh"]
