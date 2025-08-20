ARG RUBY_VERSION=3.2.2
FROM public.ecr.aws/docker/library/ruby:${RUBY_VERSION}-slim as base

# Install dependencies
RUN apt-get update -qq && \
     apt-get install -y build-essential libpq-dev nodejs default-libmysqlclient-dev git

RUN mkdir /app
WORKDIR /app 
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install
ADD . /app



# Expose port 5000
EXPOSE 5000

# Run the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "5000"]