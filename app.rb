require 'sinatra'
require 'JSON' #inbuilt JSON function


get '/' do
  File.read('views/index.html')
end

get '/favorites' do
  response.header['Content-Type'] = 'application/json'
  response.body = File.read('data.json')
end

post '/favorites' do
  file_contents = File.read('data.json') #read the current file contents
  response_hash = {}                  #creating a hash for the response
  if file_contents == nil || file_contents == ""
    file_contents = "{}"              #if the file is blank set it to a blank hash
  end

  file = JSON.parse(file_contents) # get file contents

  if params[:name] && params[:oid]
      if file.has_key?(params[:oid]) #formatting the response sent response_hash {:status, :message, :favcount}
        response_hash[:status] = 'OK'
        response_hash[:message] = 'Already in favorites!'
        response_hash[:favcount] = file.length
      else
      file[params[:oid]] = params[:name] # append to file if movie not in the list
      File.open("data.json","w") do |f|
        f.write(JSON.pretty_generate(file))
      end
      response_hash[:status] = 'OK'
      response_hash[:favcount] = file.length
      response_hash[:message] = 'Added to favorites!'
    end
    response.body = response_hash.to_json
  else
    response.body = 'Invalid Request!'
  end
end
